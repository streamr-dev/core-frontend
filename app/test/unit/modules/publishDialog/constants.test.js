import * as constants from '../../../../src/modules/publishDialog/constants'

describe('publishDialog - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/publishDialog\//))
        })
    })
})
