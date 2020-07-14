import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

const csvData = fs.readFileSync(
	path.join(__dirname, '../../db/sources/states.csv'),
	'utf8'
)

export default Papa.parse(csvData, { header: true }).data
