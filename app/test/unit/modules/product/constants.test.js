import * as constants from '../../../../src/marketplace/modules/product/constants'

describe('product - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/product\//))
        })
    })
})
