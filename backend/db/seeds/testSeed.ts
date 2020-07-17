import * as Knex from 'knex'
import tableNames from '../../src/constants/tableNames'
import states from '../../src/constants/states'
import testData from '../sources/testData'
import api from '../../src/constants/api'
import axios from 'axios'
import tableUtils from '../../src/lib/tableUtils'

export async function seed(knex: Knex): Promise<void> {
	try {
		await Promise.all(
			Object.keys(tableNames).map((tableName) => knex(tableName).del())
		)
		await knex(tableNames.state).insert(states)
		const countryData = await axios.get(api.historicUs)
		const countryList = tableUtils.cleanCountryData(countryData.data)
		await Promise.all([
			knex(tableNames.country_day).insert(countryList),
			knex(tableNames.state_day).insert(testData.stateDayList),
			knex(tableNames.state_week).insert(testData.stateWeekList)
		])
		await knex.raw('SELECT set_risk_scores();')
	} catch (error) {
		console.error(error)
	}
}
