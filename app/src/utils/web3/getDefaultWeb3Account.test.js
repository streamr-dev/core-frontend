import Web3 from 'web3'
import getWeb3 from '$utils/web3/getWeb3'
import getDefaultWeb3Account from './getDefaultWeb3Account'

jest.mock('$utils/web3/getWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('getDefaultWeb3Account', () => {
    it('resolves to present getAccounts()[0]', async () => {
        const web3 = new Web3()

        getWeb3.mockImplementation(() => web3)

        const getAccSpy = jest.fn(() => Promise.resolve(['testAccount']))

        jest.spyOn(web3.eth, 'getAccounts').mockImplementation(getAccSpy)

        const acc = await getDefaultWeb3Account()

        expect(acc).toBe('testAccount')
        expect(getAccSpy).toHaveBeenCalledTimes(1)
    })

    it('throws an error if getAccounts gives nullish value', async () => {
        const web3 = new Web3()

        getWeb3.mockImplementation(() => web3)

        await expect(getDefaultWeb3Account()).rejects.toThrow(/please unlock your/i)
    })

    it('throws an error if getAccounts gives an empty list', async () => {
        const web3 = new Web3()

        getWeb3.mockImplementation(() => web3)

        jest.spyOn(web3.eth, 'getAccounts').mockImplementation(jest.fn(() => Promise.resolve([])))

        await expect(getDefaultWeb3Account()).rejects.toThrow(/please unlock your/i)
    })
})
