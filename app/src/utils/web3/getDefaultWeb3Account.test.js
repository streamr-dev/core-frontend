import FakeProvider from 'web3-fake-provider'
import getWeb3 from '$utils/web3/getWeb3'
import getDefaultWeb3Account from './getDefaultWeb3Account'

describe('getDefaultWeb3Account', () => {
    it('resolves to present getAccounts()[0]', async () => {
        const getAccSpy = jest.fn(() => Promise.resolve(['testAccount']))

        jest.spyOn(web3.eth, 'getAccounts').mockImplementation(getAccSpy)

        const acc = await getDefaultWeb3Account(web3)

        expect(acc).toBe('testAccount')
        expect(getAccSpy).toHaveBeenCalledTimes(1)
    })

    it('throws an error if getAccounts gives nullish value', async () => {
        await expect(getDefaultWeb3Account(new Web3(new FakeProvider()))).rejects.toThrow(/please unlock/i)
    })

    it('throws an error if getAccounts gives an empty list', async () => {
        const web3 = new Web3()

        jest.spyOn(web3.eth, 'getAccounts').mockImplementation(jest.fn(() => Promise.resolve([])))

        await expect(getDefaultWeb3Account(web3)).rejects.toThrow(/please unlock/i)
    })
})
