import * as Knex from 'knex'
import tableNames from '../../src/constants/tableNames'
import api from '../../src/constants/api'
import states from '../../src/constants/states'
import stateWeek from '../sources/stateWeek.json'
import tableUtils from '../../src/lib/tableUtils'
import axios from 'axios'

export async function seed(knex: Knex): Promise<void> {
	try {
		await Promise.all(
			Object.keys(tableNames).map((tableName) => knex(tableName).del())
		)
		const stateDbArr = await knex(tableNames.state)
			.insert(states)
			.returning(['id', 'code'])
		const [countryData, stateData] = await Promise.all([
			axios.get(api.historicUs),
			axios.get(api.historicState)
		])
		const countryList = tableUtils.cleanCountryData(countryData.data)
		const stateChunkList = tableUtils.cleanStateDayData(
			stateData.data,
			stateDbArr
		)
		const stateWeekList = tableUtils.cleanStateWeekData(stateWeek, stateDbArr)
		await Promise.all([
			knex(tableNames.country_day).insert(countryList),
			...stateChunkList.map((chunk) =>
				knex(tableNames.state_day).insert(chunk)
			),
			knex(tableNames.state_week).insert(stateWeekList)
		])
		await knex.raw('SELECT set_risk_scores();')
	} catch (error) {
		console.error(error)
	}
}
