import Web3 from 'web3'
import getWeb3 from '$utils/web3/getWeb3'
import getChainId from './getChainId'

jest.mock('$utils/web3/getWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('getChainId', () => {
    it('returns the id', async () => {
        const web3 = new Web3()

        getWeb3.mockImplementation(() => web3)

        const getNetStub = jest.fn(() => Promise.resolve(6))

        jest.spyOn(web3.eth.net, 'getId').mockImplementation(getNetStub)

        const net = await getChainId()

        expect(net).toBe(6)
        expect(getNetStub).toHaveBeenCalledTimes(1)
    })
})
