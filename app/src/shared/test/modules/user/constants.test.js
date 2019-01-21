import * as constants from '$shared/modules/user/constants'

describe('user - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^shared\/user\//))
        })
    })
})
