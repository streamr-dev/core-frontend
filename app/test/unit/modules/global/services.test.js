import * as all from '$mp/modules/global/services'
import * as smartContractUtils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'

describe('global - services', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getDataPerUsd', () => {
        it('must call the correct method', async () => {
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve('10000'),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    dataPerUsd: balanceStub,
                },
            }))
            jest.spyOn(smartContractUtils, 'getContract').mockImplementation(getContractStub)
            await all.getDataPerUsd()
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub.mock.calls[0][0].abi.find((f) => f.name === 'dataPerUsd')).toBeTruthy()
            expect(balanceStub).toHaveBeenCalledTimes(1)
        })

        it('must transform the result from attoUnit to unit', async () => {
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const dataPerUsdStub = jest.fn(() => ({
                call: () => Promise.resolve(('209000000000000000000').toString()),
            }))
            jest.spyOn(smartContractUtils, 'getContract').mockImplementation(() => ({
                methods: {
                    dataPerUsd: dataPerUsdStub,
                },
            }))
            const result = await all.getDataPerUsd()
            expect(result).toBe('209')
        })
    })
})
