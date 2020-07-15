import db from './db'

export default async (): Promise<void> => {
	await db.migrate.rollback()
	await db.migrate.latest()
	await db.seed.run({ specific: 'testSeed.ts' })
}
