const tableNames = require('../../src/constants/tableNames')
const api = require('../../src/constants/api')
const states = require('../../src/constants/states')
const tableUtils = require('../../src/lib/tableUtils')
const axios = require('axios')

exports.seed = async (knex) => {
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
		await Promise.all([
			knex(tableNames.country_day).insert(countryList),
			...stateChunkList.map((chunk) => knex(tableNames.state_day).insert(chunk))
		])
	} catch (error) {
		console.error(error)
	}
}
