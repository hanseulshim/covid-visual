import * as Knex from 'knex'
import tableNames from '../../src/constants/tableNames'

export async function up(knex: Knex): Promise<void> {
	await Promise.all([
		knex.schema.createTable(tableNames.state, (table) => {
			table.increments().notNullable()
			table.string('name').notNullable().unique()
			table.string('code').notNullable().unique()
			table.integer('population').notNullable()
			table.integer('total_beds').notNullable()
			table.integer('estimated_available_beds').notNullable()
		}),
		knex.schema.createTable(tableNames.state_week, (table) => {
			table.increments().notNullable()
			table
				.integer('state_id')
				.unsigned()
				.references('id')
				.inTable(tableNames.state)
				.notNullable()
				.onDelete('cascade')
			table.date('date').notNullable()
			table.string('state').notNullable()
			table.integer('visit_count').notNullable()
			table.integer('ili_visit_count').notNullable()
			table.decimal('ili_visit_percent', 11, 9).notNullable()
		}),
		knex.schema.createTable(tableNames.state_day, (table) => {
			table.increments().notNullable()
			table
				.integer('state_id')
				.unsigned()
				.references('id')
				.inTable(tableNames.state)
				.notNullable()
				.onDelete('cascade')
			table.date('date').notNullable()
			table.string('state').notNullable()
			table.integer('positive')
			table.integer('negative')
			table.integer('pending')
			table.integer('hospitalized_currently')
			table.integer('hospitalized_cumulative')
			table.integer('in_icu_currently')
			table.integer('in_icu_cumulative')
			table.integer('on_ventilator_currently')
			table.integer('on_ventilator_cumulative')
			table.integer('recovered')
			table.integer('death')
			table.integer('total_tests_viral')
			table.integer('positive_tests_viral')
			table.integer('negative_tests_viral')
			table.integer('positive_cases_viral')
			table.integer('total_test_results')
			table.string('data_quality_grade')
			table.string('fips').notNullable()
		}),
		knex.schema.createTable(tableNames.country_day, (table) => {
			table.increments().notNullable()
			table.date('date').notNullable()
			table.integer('states').notNullable()
			table.integer('positive')
			table.integer('negative')
			table.integer('pending')
			table.integer('hospitalized_currently')
			table.integer('hospitalized_cumulative')
			table.integer('in_icu_currently')
			table.integer('in_icu_cumulative')
			table.integer('on_ventilator_currently')
			table.integer('on_ventilator_cumulative')
			table.integer('recovered')
			table.integer('death')
			table.boolean('ili_symptoms')
			table.boolean('positive_cases')
			table.boolean('documented_cases')
			table.boolean('positive_cases_percent')
			table.boolean('hospital_availability')
			table.boolean('healthcare_availability')
			table.integer('risk_score')
			table.date('date_checked').notNullable()
		}),
		knex.raw(`
			CREATE VIEW country_day_risk_calc AS
				SELECT
					cd.date,
					(
						SELECT SUM(ili_visit_count) AS ili_symptoms
						FROM state_week
						WHERE cd.date >= state_week.date AND cd.date < state_week.date + INTERVAL'7 day'
					),
					cd.positive - cd1.positive AS positive_cases,
					cd.positive - cd1.positive + cd.negative - cd1.negative AS documented_cases,
					(cd.positive::DECIMAL - cd1.positive) / cd.positive - cd1.positive + cd.negative - cd1.negative AS positive_cases_percent,
					CASE
						WHEN
							COALESCE(cd.hospitalized_currently, 0) <=
							(
								SELECT
									SUM(estimated_available_beds) AS available_beds
								FROM state
							)
						THEN TRUE ELSE FALSE
					END AS hospital_availability,
					CASE
						WHEN
							(cd.positive::DECIMAL - cd1.positive + cd.negative - cd1.negative) /
							(
								SELECT
									SUM(population) AS total_population
								FROM state
							) * 1000 > 0.7
						THEN TRUE ELSE FALSE
					END AS healthcare_availability,
					cd.risk_score
				FROM country_day AS cd, country_day AS cd1
				WHERE cd.date - INTERVAL'1 day' = cd1.date
				ORDER BY cd.date DESC;

			CREATE VIEW country_day_risk_diff_calc AS
				SELECT
					cd.date,
					cd.ili_symptoms - cd1.ili_symptoms AS ili_symptoms,
					cd.positive_cases - cd1.positive_cases AS positive_cases,
					cd.documented_cases - cd1.documented_cases AS documented_cases,
					cd.positive_cases_percent - cd1.positive_cases_percent AS positive_cases_percent,
					cd.hospital_availability::INT AS hospital_availability,
					cd.healthcare_availability::INT AS healthcare_availability
				FROM country_day_risk_calc AS cd, country_day_risk_calc AS cd1
				WHERE cd.date - INTERVAL'1 day' = cd1.date
				ORDER BY cd.date DESC;

			CREATE OR REPLACE FUNCTION "public"."set_risk_scores"()
			RETURNS "pg_catalog"."void" AS $BODY$
				DECLARE
					counter INTEGER;
					date_interval INTEGER;
					curr_date DATE;
					prev_date DATE;
					cdr RECORD;
					ili_symptoms_val DECIMAL;
					positive_cases_val DECIMAL;
					documented_cases_val DECIMAL;
					positive_cases_percent_val DECIMAL;
					hospital_availability_val INT;
					healthcare_availability_val INT;
					risk_score_calc INT;
					l_start_time timestamp = CLOCK_TIMESTAMP();
				BEGIN
					FOR cdr in SELECT * FROM country_day_risk_calc WHERE risk_score IS NULL LOOP
						counter := 0;
						date_interval := 0;
						curr_date := cdr.date;
						risk_score_calc := 0;
						
						SELECT
							date INTO prev_date
						FROM country_day_risk_calc
						WHERE date = cdr.date - INTERVAL'14 days';
						
						IF prev_date IS NULL THEN
							LOOP
								counter := counter + 1;
								EXIT WHEN counter = 15;
								SELECT
									date INTO prev_date
								FROM country_day_risk_calc
								WHERE date = curr_date - INTERVAL'1 day';
								EXIT WHEN prev_date IS NULL; 
								curr_date := prev_date;
								date_interval := counter;
							END LOOP;
							prev_date := curr_date;
						ELSE
							date_interval := 14;
						END IF;
						
						SELECT
							COALESCE(AVG(cdrdc.ili_symptoms), 0),
							COALESCE(AVG(cdrdc.positive_cases), 0),
							COALESCE(AVG(cdrdc.documented_cases), 0),
							COALESCE(AVG(cdrdc.positive_cases_percent), 0),
							COALESCE(SUM(cdrdc.hospital_availability) - (date_interval/2), 0),
							COALESCE(SUM(cdrdc.healthcare_availability) - (date_interval/2), 0)
						INTO ili_symptoms_val, positive_cases_val, documented_cases_val, positive_cases_percent_val, hospital_availability_val, healthcare_availability_val
						FROM country_day_risk_diff_calc cdrdc
						WHERE date >= prev_date
						AND date <= cdr.date;
				
						IF ili_symptoms_val >= 0 THEN
							risk_score_calc := risk_score_calc + 1;
						END IF;
						IF positive_cases_val >= 0 THEN
							risk_score_calc := risk_score_calc + 1;
						END IF;
						IF documented_cases_val >= 0 THEN
							risk_score_calc := risk_score_calc + 1;
						END IF;
						IF positive_cases_percent_val >= 0 THEN
							risk_score_calc := risk_score_calc + 1;
						END IF;
						IF hospital_availability_val <= 0 THEN
							risk_score_calc := risk_score_calc + 1;
						END IF;
						IF healthcare_availability_val <= 0 THEN
							risk_score_calc := risk_score_calc + 1;
						END IF;
				
						UPDATE country_day AS cd SET
							risk_score = risk_score_calc,
							ili_symptoms = CASE WHEN ili_symptoms_val >= 0 THEN FALSE ELSE TRUE END,
							positive_cases = CASE WHEN positive_cases_val >= 0 THEN FALSE ELSE TRUE END,
							documented_cases = CASE WHEN documented_cases_val >= 0 THEN FALSE ELSE TRUE END,
							positive_cases_percent = CASE WHEN positive_cases_percent_val >= 0 THEN FALSE ELSE TRUE END,
							hospital_availability = CASE WHEN hospital_availability_val <= 0 THEN FALSE ELSE TRUE END,
							healthcare_availability = CASE WHEN healthcare_availability_val <= 0 THEN FALSE ELSE TRUE END
						WHERE cd.date = cdr.date;
						RAISE NOTICE 'cdr.date: %', cdr.date;
						RAISE NOTICE 'ili_symptoms_val: %', ili_symptoms_val;
						RAISE NOTICE 'positive_cases_val: %', positive_cases_val;
						RAISE NOTICE 'documented_cases_val: %', documented_cases_val;
						RAISE NOTICE 'positive_cases_percent_val: %', positive_cases_percent_val;
						RAISE NOTICE 'hospital_availability_val: %', hospital_availability_val;
						RAISE NOTICE 'healthcare_availability_val: %', healthcare_availability_val;
						RAISE NOTICE 'Risk Score: %', risk_score_calc;
						
					END LOOP;
					RAISE NOTICE USING MESSAGE = '******* end --> ' || age(CLOCK_TIMESTAMP(), l_start_time)::text;
				END;
				$BODY$
			LANGUAGE plpgsql VOLATILE
			COST 100;
		`)
	])
}

export async function down(knex: Knex): Promise<void> {
	await Promise.all([
		knex.raw(`
			DROP FUNCTION IF EXISTS set_risk_scores();
			DROP VIEW IF EXISTS country_day_risk_diff_calc;
			DROP VIEW IF EXISTS country_day_risk_calc;
		`),
		...[
			tableNames.state_day,
			tableNames.state_week,
			tableNames.state,
			tableNames.country_day
		].map((tableName) => knex.schema.dropTableIfExists(tableName))
	])
}
