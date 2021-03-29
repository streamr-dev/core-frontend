import * as all from '$mp/modules/contractProduct/services'
import * as utils from '$mp/utils/smartContract'
import { mapPriceToContract } from '$mp/utils/product'

describe('Product services', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getProductFromContract', () => {
        it('must convert weis to token', async () => {
            const getProductStub = jest.fn(() => ({
                call: () => Promise.resolve({
                    pricePerSecond: '1000000000000000000',
                }),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    getProduct: getProductStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            const result = await all.getProductFromContract('1234abcdef')
            expect({
                priceCurrency: undefined,
                state: undefined,
                pricePerSecond: '1',
                id: '1234abcdef',
                name: undefined,
                ownerAddress: undefined,
                beneficiaryAddress: undefined,
                minimumSubscriptionInSeconds: 0,
                requiresWhitelist: undefined,
            }).toStrictEqual(result)
            expect(getContractStub).toBeCalled()
            expect(getProductStub).toBeCalled()
            expect(getProductStub).toBeCalledWith('0x1234abcdef')
        })

        it('must throw error if owner is 0', async (done) => {
            const getProductStub = jest.fn(() => ({
                call: () => Promise.resolve({
                    owner: '0x000',
                    pricePerSecond: '0',
                }),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    getProduct: getProductStub,
                },
            }))
            try {
                await all.getProductFromContract('1234abcdef')
            } catch (e) {
                expect(e.message).toMatch(/No product found/)
                done()
            }
        })
    })

    describe('createContractProduct', () => {
        let exampleProduct
        beforeEach(() => {
            exampleProduct = {
                id: '1234abcdef',
                name: 'Awesome Granite Sausages',
                description: 'Minus dolores reprehenderit velit. Suscipit excepturi iure ea asperiores nam dolores nemo. Et repellat inventore.',
                category: 'dfd',
                streams: [],
                previewStream: null,
                dateCreated: '2018-03-27T08:51:37.261Z',
                lastUpdated: '2018-03-27T08:51:37.261Z',
                ownerAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                beneficiaryAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                pricePerSecond: '63',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: 0,
                imageUrl: null,
            }
        })
        it('must fail if no id', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    id: null,
                })
            } catch (e) {
                expect(e.message).toMatch(/not a valid hex/)
                done()
            }
        })
        it('must transform the currency to number', () => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'DATA',
            })
            expect(createContractProductStub).toHaveBeenCalledTimes(2)
            expect(createContractProductStub).toHaveBeenNthCalledWith(
                1,
                `0x${exampleProduct.id}`,
                exampleProduct.name,
                exampleProduct.beneficiaryAddress,
                mapPriceToContract(exampleProduct.pricePerSecond),
                1,
                0,
            )
            expect(createContractProductStub).toHaveBeenNthCalledWith(
                2,
                `0x${exampleProduct.id}`,
                exampleProduct.name,
                exampleProduct.beneficiaryAddress,
                mapPriceToContract(exampleProduct.pricePerSecond),
                0,
                0,
            )
        })
        it('must fail if price is 0', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    pricePerSecond: '0',
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must fail if price is negative', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    pricePerSecond: -3,
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must fail if invalid currency', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    priceCurrency: 'foobar',
                })
            } catch (e) {
                expect(e.message).toMatch('Invalid currency: foobar')
                done()
            }
        })
        it('must call send with correct object', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: () => 'test',
                },
            }))
            all.createContractProduct(exampleProduct)
        })
        it('must return the result of send', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: () => {
                    },
                },
            }))
            expect(all.createContractProduct(exampleProduct)).toBe('test')
        })
        it('must call createProduct with correct params (when DATA)', () => {
            const createProductSpy = jest.fn()
            jest.spyOn(utils, 'send').mockImplementation(jest.fn())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createProductSpy,
                },
            }))
            all.createContractProduct(exampleProduct)
            expect(createProductSpy).toBeCalled()
            expect(createProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                0,
                0,
            )
        })
        it('must call createProduct with correct params (when USD)', () => {
            const createProductSpy = jest.fn()
            jest.spyOn(utils, 'send').mockImplementation(jest.fn())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createProductSpy,
                },
            }))
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            expect(createProductSpy).toBeCalled()
            expect(createProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                1,
                0,
            )
        })
    })

    describe('updateContractProduct', () => {
        let exampleProduct
        beforeEach(() => {
            exampleProduct = {
                id: '1234abcdef',
                name: 'Awesome Granite Sausages',
                description: 'Minus dolores reprehenderit velit. Suscipit excepturi iure ea asperiores nam dolores nemo. Et repellat inventore.',
                category: 'dfd',
                streams: [],
                previewStream: null,
                dateCreated: '2018-03-27T08:51:37.261Z',
                lastUpdated: '2018-03-27T08:51:37.261Z',
                ownerAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                beneficiaryAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                pricePerSecond: 63,
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: 0,
                imageUrl: null,
            }
        })
        it('must fail if no id', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    id: null,
                })
            } catch (e) {
                expect(e.message).toMatch(/not a valid hex/)
                done()
            }
        })
        it('must transform the currency to number', () => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            all.updateContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            all.updateContractProduct({
                ...exampleProduct,
                priceCurrency: 'DATA',
            })
            expect(updateContractProductStub).toHaveBeenCalledTimes(2)
            expect(updateContractProductStub).toHaveBeenNthCalledWith(
                1,
                `0x${exampleProduct.id}`,
                exampleProduct.name,
                exampleProduct.beneficiaryAddress,
                mapPriceToContract(exampleProduct.pricePerSecond),
                1,
                0,
                false,
            )
            expect(updateContractProductStub).toHaveBeenNthCalledWith(
                2,
                `0x${exampleProduct.id}`,
                exampleProduct.name,
                exampleProduct.beneficiaryAddress,
                mapPriceToContract(exampleProduct.pricePerSecond),
                0,
                0,
                false,
            )
        })
        it('must fail if price is 0', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    pricePerSecond: 0,
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must fail if price is negative', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    pricePerSecond: -3,
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must fail if invalid currency', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    priceCurrency: 'foobar',
                })
            } catch (e) {
                expect(e.message).toMatch('Invalid currency: foobar')
                done()
            }
        })
        it('must call send with correct object', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: () => 'test',
                },
            }))
            all.updateContractProduct(exampleProduct)
        })
        it('must return the result of send', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: () => {
                    },
                },
            }))
            expect(all.updateContractProduct(exampleProduct)).toBe('test')
        })
        it('must call updateProduct with correct params (when DATA)', () => {
            const updateProductSpy = jest.fn()
            jest.spyOn(utils, 'send')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateProductSpy,
                },
            }))
            all.updateContractProduct(exampleProduct)
            expect(updateProductSpy).toHaveBeenCalledTimes(1)
            expect(updateProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                0,
                0,
                false,
            )
        })
        it('must call updateProductSpy with correct params (when USD)', () => {
            const updateProductSpy = jest.fn()
            jest.spyOn(utils, 'send')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateProductSpy,
                },
            }))
            all.updateContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            expect(updateProductSpy).toHaveBeenCalledTimes(1)
            expect(updateProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                1,
                0,
                false,
            )
        })
        it('must call updateProductSpy with correct params redeploying', () => {
            const updateProductSpy = jest.fn()
            jest.spyOn(utils, 'send')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateProductSpy,
                },
            }))
            all.updateContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            }, true)
            expect(updateProductSpy).toHaveBeenCalledTimes(1)
            expect(updateProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                1,
                0,
                true,
            )
        })
    })

    describe('deleteProduct', () => {
        it('calls deleteProduct contract method', async () => {
            const deleteProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    deleteProduct: deleteProductStub,
                },
            }))
            await all.deleteProduct('1')
            expect(deleteProductStub).toBeCalledWith('0x1')
            expect(deleteProductStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('redeployProduct', () => {
        it('calls redeployProduct contract method', async () => {
            const redeployProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    redeployProduct: redeployProductStub,
                },
            }))
            await all.redeployProduct('1')
            expect(redeployProductStub).toBeCalledWith('0x1')
            expect(redeployProductStub).toHaveBeenCalledTimes(1)
        })
    })
})
