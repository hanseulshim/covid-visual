const Knex = require('knex')
const tableNames = require('../../src/constants/tableNames')

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
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
			table.dateTime('date').notNullable()
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
			table.dateTime('date').notNullable()
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
			table.dateTime('date').notNullable()
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
			table.dateTime('date_checked').notNullable()
		})
	])
}

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
	await Promise.all(
		[
			tableNames.state_day,
			tableNames.state_week,
			tableNames.state,
			tableNames.country_day
		].map((tableName) => knex.schema.dropTableIfExists(tableName))
	)
}
