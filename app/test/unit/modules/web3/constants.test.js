import * as constants from '../../../../src/modules/web3/constants'

describe('web3 - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/web3\//))
        })
    })
})
