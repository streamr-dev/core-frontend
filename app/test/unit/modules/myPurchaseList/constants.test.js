import * as constants from '../../../../src/marketplace/modules/myPurchaseList/constants'

describe('global - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/myPurchaseList\//))
        })
    })
})
