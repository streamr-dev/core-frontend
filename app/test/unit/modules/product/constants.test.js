import * as constants from '$mp/modules/product/constants'

describe('product - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/product\//))
        })
    })
})
