import axios from 'axios'

const URL = 'http://localhost:5000/api'

export const getCountryData = async () => {
  try {
    const result = await axios.get(`${URL}/country`)
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export const getTrendData = async date => {
  try {
    const result = await axios.post(`${URL}/country/trend`, { date })
    return result.data
  } catch (error) {
    console.log(error)
  }
}
