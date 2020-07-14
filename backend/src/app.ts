import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'

import { notFound, errorHandler } from './middleware'

const app: Application = express()

app.use(morgan('tiny'))
app.use(compression())
app.use(helmet())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send('Hello')
})

app.use(notFound)
app.use(errorHandler)

export default app
