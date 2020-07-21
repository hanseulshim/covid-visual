import { Model } from 'objection'
import connection from '../../db'
Model.knex(connection)

class Country extends Model {
	date!: Date
	positiveCases!: number

	static get tableName(): string {
		return 'countryDay'
	}
}

// export class CountryRisk extends Model {
// 	static get tableName(): string {
// 		return 'countryDayRiskCalc'
// 	}
// }

export default Country
