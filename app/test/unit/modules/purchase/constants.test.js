import * as constants from '../../../../src/marketplace/modules/purchase/constants'

describe('purchase - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/purchase\//))
        })
    })
})
