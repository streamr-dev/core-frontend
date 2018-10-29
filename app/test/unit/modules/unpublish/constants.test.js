import * as constants from '$mp/modules/unpublish/constants'

describe('unpublish - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/unpublish\//))
        })
    })
})
