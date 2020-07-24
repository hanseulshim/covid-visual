import express, { Router, Request, Response, NextFunction } from 'express'
import { raw } from 'objection'
import { Country, CountryRisk, State } from './country.model'
import moment from 'moment'

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

router.post(
  '/trend',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { date } = req.body
      if (!date) {
        throw new Error('Invalid Date!')
      }
      const currentDate = moment(date, 'MM-DD-YYYY')
      const pastDate = moment(date, 'MM-DD-YYYY').subtract(14, 'day')
      const trendList = await CountryRisk.query()
        .select(
          raw(`to_char(date, 'MM-DD-YYYY') as date`),
          raw('ili_symptoms::INT as ili_symptoms'),
          'positiveCases',
          'documentedCases',
          raw('positive_cases_percent::FLOAT as positive_cases_percent')
        )
        .whereNotNull('positiveCases')
        .andWhere('date', '<=', currentDate.format('MM-DD-YYYY'))
        .andWhere('date', '>', pastDate.format('MM-DD-YYYY'))
        .orderBy('date')
      const currentDay = await Country.query()
        .select(
          raw(`to_char(date, 'MM-DD-YYYY') as date`),
          'iliSymptoms',
          'positiveCases',
          'documentedCases',
          'positiveCasesPercent',
          'hospitalAvailability',
          'healthcareAvailability',
          'riskScore'
        )
        .where('date', currentDate.format('MM-DD-YYYY'))
        .first()
      const stateList = await State.query()
        .select(
          raw(`to_char(date, 'MM-DD-YYYY') as date`),
          'state',
          'riskScore',
          raw('positive as positive_cases')
        )
        .where('date', currentDate.format('MM-DD-YYYY'))
      res.json({
        trendList,
        currentDay,
        stateList
      })
    } catch (e) {
      next(e)
    }
  }
)

export default router
