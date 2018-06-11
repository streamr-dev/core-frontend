import * as constants from '../../../../modules/streams/constants'

describe('streams - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/streams\//))
        })
    })
})
