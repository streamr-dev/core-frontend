import * as constants from '../../../../src/marketplace/modules/publish/constants'

describe('publish - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/publish\//))
        })
    })
})
