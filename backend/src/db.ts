import knex from 'knex'
import { knexSnakeCaseMappers } from 'objection'
import knexConfig from '../knexfile'

const environment = process.env.NODE_ENV || 'development'
const connectionConfig = knexConfig[environment]

const connection = knex({ ...connectionConfig, ...knexSnakeCaseMappers() })

export default connection
