import * as constants from '$mp/modules/allowance/constants'

describe('allowance - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/allowance\//))
        })
    })
})
