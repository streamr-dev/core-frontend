import * as constants from '../../../../modules/contractProduct/constants'

describe('contractProduct - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/contractProduct\//))
        })
    })
})
