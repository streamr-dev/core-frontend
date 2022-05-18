import * as constants from '$mp/modules/product/constants'

describe('product - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            if (key === '__esModule') {
                return // ignore __esModule: true
            }
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/product\//))
        })
    })
})
