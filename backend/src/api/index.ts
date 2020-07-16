import express, { Router, Request, Response } from 'express'
import { message } from '../constants/project'
import country from './country/country.routes'

const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
	res.json({
		message
	})
})

router.use('/country', country)

export default router
