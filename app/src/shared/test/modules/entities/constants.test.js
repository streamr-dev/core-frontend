import * as constants from '$shared/modules/entities/constants'

describe('entities - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            if (key === '__esModule') {
                return // ignore __esModule: true
            }
            expect(constants[key]).toEqual(expect.stringMatching(/^shared\/entities\//))
        })
    })
})
