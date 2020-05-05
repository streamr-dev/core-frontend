/* eslint-disable global-require */

describe('', () => {
    let oldDataUnionsFlag

    beforeEach(() => {
        oldDataUnionsFlag = process.env.DATA_UNIONS_DOCS
    })

    afterEach(() => {
        process.env.DATA_UNIONS_DOCS = oldDataUnionsFlag
    })

    it('does not have Data Unions section by default', async () => {
        delete process.env.DATA_UNIONS_DOCS

        const { generateMap } = await import('./docsMap')
        const docsMap = generateMap()

        expect(Object.keys(docsMap).length).toBe(15)
        expect('Data Unions' in docsMap).toBeFalsy()
    })

    it('has Data Unions section if DATA_UNIONS_DOCS flag is defined', async () => {
        process.env.DATA_UNIONS_DOCS = 'on'

        const { generateMap } = await import('./docsMap')
        const docsMap = generateMap()

        expect(Object.keys(docsMap).length).toBe(16)
        expect('Data Unions' in docsMap).toBe(true)
    })
})

/* eslint-enable global-require */
