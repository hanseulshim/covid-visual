import * as Knex from 'knex'
import tableNames from '../../src/constants/tableNames'
import states from '../../src/constants/states'
import testData from '../sources/testData'

export async function seed(knex: Knex): Promise<void> {
	try {
		await Promise.all(
			Object.keys(tableNames).map((tableName) => knex(tableName).del())
		)
		await knex(tableNames.state).insert(states)
		await Promise.all([
			knex(tableNames.country_day).insert(testData.countryList),
			knex(tableNames.state_day).insert(testData.stateDayList),
			knex(tableNames.state_week).insert(testData.stateWeekList)
		])
		await knex.raw('SELECT set_risk_scores();')
	} catch (error) {
		console.error(error)
	}
}
