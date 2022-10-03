import * as constants from '$mp/modules/myProductList/constants'

describe('myProductList - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            if (key === '__esModule') {
                return // ignore __esModule: true
            }
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/myProductList\//))
        })
    })
})
