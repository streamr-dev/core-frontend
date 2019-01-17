import * as constants from '$shared/modules/integrationKey/constants'

describe('integrationKey - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^shared\/integrationKey\//))
        })
    })
})
