import * as all from '$mp/modules/global/services'
import * as smartContractUtils from '$mp/utils/smartContract'

describe('global - services', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getDataPerUsd', () => {
        it('must call the correct method', async () => {
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
