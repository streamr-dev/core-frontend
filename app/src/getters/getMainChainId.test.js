import getConfig from '$app/src/getters/getConfig'
import g from './getMainChainId'

jest.mock('$app/src/getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('getMainChainId', () => {
    it('returns the main chain id (from configs)', () => {
        getConfig.mockImplementation(() => ({
            client: {
                mainchain: {
                    chainId: 1337,
                },
            },
        }))

        expect(g()).toEqual(1337)
    })
})
