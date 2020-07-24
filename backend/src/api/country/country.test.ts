import supertest from 'supertest'

import app from '../../app'

describe('GET /api/country', () => {
  it('should return list of country dates', async () => {
    const response = await supertest(app)
      .get('/api/country')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body).toHaveProperty('countryList')
    expect(response.body.countryList.length).toBeGreaterThan(0)
  })
  it('should return percent difference', async () => {
    const response = await supertest(app)
      .get('/api/country')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body).toHaveProperty('percentDifference')
    expect(typeof response.body.percentDifference).toBe('number')
  })
  it('should return relative max', async () => {
    const response = await supertest(app)
      .get('/api/country')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body).toHaveProperty('relativeMin')
    expect(response.body.relativeMin).toHaveProperty('date')
    expect(typeof response.body.relativeMin.date).toBe('string')
    expect(response.body.relativeMin).toHaveProperty('positiveCases')
    expect(typeof response.body.relativeMin.positiveCases).toBe('number')
    expect(response.body.relativeMin).toHaveProperty('riskScore')
    expect(typeof response.body.relativeMin.riskScore).toBe('number')
  })
  it('should only have three properties', async () => {
    const response = await supertest(app)
      .get('/api/country')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(Object.keys(response.body).length).toEqual(3)
  })
})
