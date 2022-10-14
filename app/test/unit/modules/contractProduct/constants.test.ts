import {contractProductConstants} from '$mp/modules/contractProduct/constants'
describe('contractProduct - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(contractProductConstants).forEach((key) => {
            if (key === '__esModule') {
                return // ignore __esModule: true
            }

            expect(contractProductConstants[key]).toEqual(expect.stringMatching(/^marketplace\/contractProduct\//))
        })
    })
})
