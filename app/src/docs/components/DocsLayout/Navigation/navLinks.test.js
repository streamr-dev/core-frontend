/* eslint-disable global-require */

describe('', () => {
    let oldDataUnionsFlag

    beforeEach(() => {
        oldDataUnionsFlag = process.env.DATA_UNIONS
    })

    afterEach(() => {
        process.env.DATA_UNIONS = oldDataUnionsFlag
    })

    it('does not have Data Unions section by default', async () => {
        delete process.env.DATA_UNIONS

        const { generateNav } = await import('./navLinks')
        const docsNav = generateNav()

        expect(Object.keys(docsNav).length).toBe(14)
        expect('Data Unions' in docsNav).toBeFalsy()
    })

    it('has Data Unions section if DATA_UNIONS flag is defined', async () => {
        process.env.DATA_UNIONS = 'on'

        const { generateNav } = await import('./navLinks')
        const docsNav = generateNav()

        expect(Object.keys(docsNav).length).toBe(15)
        expect('Data Unions' in docsNav).toBe(true)
    })
})

/* eslint-enable global-require */
