import * as constants from '$mp/modules/purchase/constants'

describe('purchase - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/purchase\//))
        })
    })
})
