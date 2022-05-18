import * as constants from '$shared/modules/user/constants'

describe('user - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            if (key === '__esModule') {
                return // ignore __esModule: true
            }
            expect(constants[key]).toEqual(expect.stringMatching(/^shared\/user\//))
        })
    })
})
