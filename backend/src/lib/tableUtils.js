const chunk = require('lodash.chunk')
const moment = require('moment')

const cleanCountryData = (countryArr) => {
	if (countryArr.length === 0) {
		throw new Error('No country list found.')
	}
	return countryArr.map((country) => ({
		date: country.date,
		states: country.states,
		positive: country.positive,
		negative: country.negative,
		pending: country.pending,
		hospitalized_currently: country.hospitalizedCurrently,
		hospitalized_cumulative: country.hospitalizedCumulative,
		in_icu_currently: country.inIcuCurrently,
		in_icu_cumulative: country.inIcuCumulative,
		on_ventilator_currently: country.onVentilatorCurrently,
		on_ventilator_cumulative: country.onVentilatorCumulative,
		recovered: country.recovered,
		date_checked: country.dateChecked,
		death: country.death
	}))
}

const cleanStateDayData = (stateArr, stateDbArr) => {
	if (stateArr.length === 0) {
		throw new Error('No state list found.')
	}
	const validStateCodes = stateDbArr.map((s) => s.code)
	return chunk(
		stateArr
			.filter((state) => validStateCodes.includes(state.state))
			.map((state) => {
				const foundState = stateDbArr.find((s) => s.code === state.state)
				return {
					state_id: foundState.id,
					date: moment(state.date).format('YYYYMMDD'),
					state: state.state,
					positive: state.positive,
					negative: state.negative,
					pending: state.pending,
					hospitalized_currently: state.hospitalizedCurrently,
					hospitalized_cumulative: state.hospitalizedCumulative,
					in_icu_currently: state.inIcuCurrently,
					in_icu_cumulative: state.inIcuCumulative,
					on_ventilator_currently: state.onVentilatorCurrently,
					on_ventilator_cumulative: state.onVentilatorCumulative,
					recovered: state.recovered,
					death: state.death,
					total_tests_viral: state.totalTestsViral,
					positive_tests_viral: state.positiveTestsViral,
					negative_tests_viral: state.negativeTestsViral,
					positive_cases_viral: state.positiveCasesViral,
					total_test_results: state.totalTestResults,
					data_quality_grade: state.dataQualityGrade,
					fips: state.fips
				}
			}),
		1000
	)
}

module.exports = {
	cleanCountryData,
	cleanStateDayData
}
