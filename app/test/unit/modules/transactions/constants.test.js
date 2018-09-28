import * as constants from '$mp/modules/transactions/constants'

describe('streams - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/transactions\//))
        })
    })
})
