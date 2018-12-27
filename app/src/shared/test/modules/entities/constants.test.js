import * as constants from '$shared/modules/entities/constants'

describe('entities - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^shared\/entities\//))
        })
    })
})
