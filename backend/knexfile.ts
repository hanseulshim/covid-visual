import { config } from 'dotenv'
require('ts-node/register')
config()

interface KnexConfig {
	[key: string]: {
		debug?: boolean
		client: string
		connection: {
			database?: string
			user?: string
			password?: string
		}
		migrations: {
			directory: string
		}
		seeds: {
			directory: string
		}
	}
}

const defaultConfig: KnexConfig = {
	development: {
		debug: true,
		client: 'pg',
		connection: {
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD
		},
		migrations: {
			directory: './db/migrations'
		},
		seeds: {
			directory: './db/seeds'
		}
	},
	test: {
		client: 'pg',
		connection: {
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD
		},
		migrations: {
			directory: './db/migrations'
		},
		seeds: {
			directory: './db/seeds'
		}
	}
}

module.exports = defaultConfig
export default defaultConfig
