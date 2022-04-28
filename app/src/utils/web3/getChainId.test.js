import Web3 from 'web3'
import getChainId from './getChainId'

describe('getChainId', () => {
    it('returns the id', async () => {
        const web3 = new Web3()
        const getNetStub = jest.fn(() => Promise.resolve(6))

        jest.spyOn(web3.eth.net, 'getId').mockImplementation(getNetStub)

        const net = await getChainId(web3)

        expect(net).toBe('6')
        expect(getNetStub).toHaveBeenCalledTimes(1)
    })
})
