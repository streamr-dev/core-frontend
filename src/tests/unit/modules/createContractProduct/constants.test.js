import * as constants from '../../../../modules/createContractProduct/constants'

describe('createContractProduct - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/createContractProduct\//))
        })
    })
})
