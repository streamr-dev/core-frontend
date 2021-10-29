/* eslint-disable global-require */

describe('', () => {
    it('has Data Unions section', async () => {
        const { generateMap } = await import('./docsMap')
        const docsMap = generateMap()

        expect(Object.keys(docsMap).length).toBe(6)
        expect('Data Unions' in docsMap).toBe(true)
    })
})

/* eslint-enable global-require */
