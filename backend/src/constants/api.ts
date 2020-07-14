const covidTrackingApi = 'https://covidtracking.com'
export default {
	historicUs: `${covidTrackingApi}/api/v1/us/daily.json`,
	currentUs: `${covidTrackingApi}/api/v1/us/current.json`,
	historicState: `${covidTrackingApi}/api/v1/states/daily.json`
}
