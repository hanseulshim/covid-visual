import express, { Router, Request, Response, NextFunction } from 'express'
import Country from './country.model'

const router: Router = express.Router()

router.get(
	'/',
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const countryList = await Country.query()
				.select('date', 'positiveDay as positiveCases', 'riskScore')
				.whereNotNull('positiveCases')
				.orderBy('date')
			const recentDay = countryList[countryList.length - 1]
			const relativeMax = await Country.query()
				.select('date', 'positiveDay as positiveCases', 'riskScore')
				.where(
					'positiveDay',
					Country.query().max('positiveDay').where('date', '<', '2020-06-01')
				)
				.first()
			const percentDifference =
				(recentDay.positiveCases - relativeMax.positiveCases) /
				relativeMax.positiveCases
			res.json({
				relativeMax,
				percentDifference,
				countryList
			})
		} catch (e) {
			next(e)
		}
	}
)

export default router
