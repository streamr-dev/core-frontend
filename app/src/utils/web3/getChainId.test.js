import getWeb3 from '$utils/web3/getWeb3'
import getChainId from './getChainId'

describe('getChainId', () => {
    it('returns the id', async () => {
        const getNetStub = jest.fn(() => Promise.resolve(6))

        jest.spyOn(web3.eth.net, 'getId').mockImplementation(getNetStub)

        const net = await getChainId()

        expect(net).toBe('6')
        expect(getNetStub).toHaveBeenCalledTimes(1)
    })
})
