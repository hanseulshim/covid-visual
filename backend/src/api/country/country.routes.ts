import express, { Router, Request, Response, NextFunction } from 'express'
import { raw } from 'objection'
import Country from './country.model'

const router: Router = express.Router()

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const countryList = await Country.query()
        .select(
          raw(`to_char(date, 'MM-DD-YYYY') as date`),
          'positiveDay as positiveCases',
          'riskScore'
        )
        .whereNotNull('positiveCases')
        .orderBy('date')
      const recentDay = countryList[countryList.length - 1]
      const relativeMin = await Country.query()
        .select(
          raw(`to_char(date, 'MM-DD-YYYY') as date`),
          'positiveDay as positiveCases',
          'riskScore'
        )
        .where(
          'positiveDay',
          Country.query().min('positiveDay').where('date', '>', '2020-05-01')
        )
        .first()
      const percentDifference =
        (recentDay.positiveCases - relativeMin.positiveCases) /
        relativeMin.positiveCases
      res.json({
        relativeMin,
        percentDifference,
        countryList
      })
    } catch (e) {
      next(e)
    }
  }
)

export default router
