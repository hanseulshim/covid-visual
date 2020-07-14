import chunk from 'lodash.chunk'
import moment from 'moment'

interface Country {
	date: string
	states: number
	positive: number | null
	negative: number | null
	pending: number | null
	hospitalizedCurrently: number | null
	hospitalizedCumulative: number | null
	inIcuCurrently: number | null
	inIcuCumulative: number | null
	onVentilatorCurrently: number | null
	onVentilatorCumulative: number | null
	recovered: number | null
	dateChecked: number | null
	death: number | null
}

interface State {
	date: string
	state: string
	positive: number | null
	negative: number | null
	pending: number | null
	hospitalizedCurrently: number | null
	hospitalizedCumulative: number | null
	inIcuCurrently: number | null
	inIcuCumulative: number | null
	onVentilatorCurrently: number | null
	onVentilatorCumulative: number | null
	recovered: number | null
	death: number | null
	totalTestsViral: number | null
	positiveTestsViral: number | null
	negativeTestsViral: number | null
	positiveCasesViral: number | null
	totalTestResults: number | null
	dataQualityGrade: string | null
	fips: string
}

interface StateWeek {
	DEPARTMENTSTATE: string
	WEEKDATE: string
	VISITCNT: number
	ILIVISITCNT: number
	ILIVISITPCT: number
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cleanCountryData = (countryArr: Country[]) => {
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cleanStateDayData = (
	stateArr: State[],
	stateDbArr: { id: number; code: string }[]
) => {
	if (stateArr.length === 0) {
		throw new Error('No state list found.')
	}
	return chunk(
		stateArr
			.filter((state) => stateDbArr.map((s) => s.code).includes(state.state))
			.map((state) => {
				const foundState = stateDbArr.find((s) => s.code === state.state)
				if (!foundState) throw new Error('State id not found')
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cleanStateWeekData = (
	stateArr: StateWeek[],
	stateDbArr: { id: number; code: string }[]
) => {
	if (stateArr.length === 0) {
		throw new Error('No state list found.')
	}
	return stateArr
		.filter((state) =>
			stateDbArr.map((s) => s.code).includes(state.DEPARTMENTSTATE)
		)
		.map((state) => {
			const foundState = stateDbArr.find(
				(s) => s.code === state.DEPARTMENTSTATE
			)
			if (!foundState) throw new Error('State id not found')
			return {
				state_id: foundState.id,
				date: state.WEEKDATE,
				state: foundState.code,
				visit_count: state.VISITCNT,
				ili_visit_count: state.ILIVISITCNT,
				ili_visit_percent: state.ILIVISITPCT
			}
		})
}

export default {
	cleanCountryData,
	cleanStateDayData,
	cleanStateWeekData
}
