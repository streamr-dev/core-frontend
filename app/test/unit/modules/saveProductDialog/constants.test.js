import * as constants from '$mp/modules/deprecated/saveProductDialog/constants'

describe('saveProductDialog - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/saveProductDialog\//))
        })
    })
})
