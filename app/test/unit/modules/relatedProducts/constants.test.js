import * as constants from '../../../../src/modules/relatedProducts/constants'

describe('relatedProducts - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/relatedProducts\//))
        })
    })
})
