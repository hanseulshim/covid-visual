import supertest from 'supertest'

import app from './app'
import { message, errorMessage } from './constants/project'

describe('GET /', () => {
	it('should respond with a message', async () => {
		const response = await supertest(app)
			.get('/')
			.expect('Content-Type', /json/)
			.expect(200)

		expect(response.body.message).toEqual(message)
	})
})

describe('GET /invalid', () => {
	it('should respond with a not found message', async () => {
		const response = await supertest(app)
			.get('/invalid')
			.expect('Content-Type', /json/)
			.expect(404)

		expect(response.body.message).toEqual(`${errorMessage}/invalid`)
	})
})
