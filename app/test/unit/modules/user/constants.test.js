import * as constants from '../../../../src/marketplace/modules/user/constants'

describe('user - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/user\//))
        })
    })
})
