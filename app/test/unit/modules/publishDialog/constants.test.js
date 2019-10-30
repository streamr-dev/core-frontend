import * as constants from '$mp/modules/deprecated/publishDialog/constants'

describe('publishDialog - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/publishDialog\//))
        })
    })
})
