import knex from 'knex'
import { Model } from 'objection'

import knexConfig from '../knexfile'

const environment = process.env.NODE_ENV || 'development'
const connectionConfig = knexConfig[environment]

const connection = knex(connectionConfig)

Model.knex(connection)

export default connection
