module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globalSetup: './src/setupTests.ts',
	globalTeardown: './src/teardownTests.ts'
}
