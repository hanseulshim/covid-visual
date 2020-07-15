import db from './db'

export default async (): Promise<void> => {
	await db.destroy()
}
