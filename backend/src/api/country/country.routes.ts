import express, { Router, Request, Response, NextFunction } from 'express'
import Country from './country.model'

const router: Router = express.Router()

router.get(
	'/',
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const countryList = await Country.query()
				.select('id', 'date', 'positiveDay')
				.orderBy('date', 'DESC')
			const [relativeMax, absoluteMax] = await Promise.all([
				Country.query()
					.select('date', 'positiveDay')
					.where(
						'positiveDay',
						Country.query().max('positiveDay').where('date', '<', '2020-06-01')
					)
					.first(),
				Country.query()
					.select('date', 'positiveDay')
					.where('positiveDay', Country.query().max('positiveDay'))
					.first()
			])
			const percentDifference =
				(absoluteMax.positiveDay - relativeMax.positiveDay) /
				relativeMax.positiveDay
			res.json({
				relativeMax,
				absoluteMax,
				percentDifference,
				countryList
			})
		} catch (e) {
			next(e)
		}
	}
)

export default router
