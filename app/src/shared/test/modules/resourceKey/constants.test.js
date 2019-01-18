import * as constants from '$shared/modules/resourceKey/constants'

describe('resourceKey - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^shared\/resourceKey\//))
        })
    })
})
