import assert from 'assert-diff'
import BN from 'bignumber.js'

import { productStates } from '$shared/utils/constants'

import * as all from '$mp/utils/product'

describe('product utils', () => {
    describe('isPaidProduct', () => {
        it('detects a free product', () => {
            const product = {
                isFree: true,
                pricePerSecond: 0,
            }
            assert.equal(all.isPaidProduct(product), false)
        })

        it('detects a paid product', () => {
            const product = {
                isFree: false,
                pricePerSecond: 1000,
            }
            assert.equal(all.isPaidProduct(product), true)
        })
    })

    describe('isDataUnionProduct', () => {
        it('detects data union product from object', () => {
            const product1 = {
                id: 'text',
                type: 'DATAUNION',
            }
            assert.equal(all.isDataUnionProduct(product1), true)
            const product2 = {
                id: 'text',
                type: 'NORMAL',
            }
            assert.equal(all.isDataUnionProduct(product2), false)
        })

        it('detects data union product from empty object', () => {
            assert.equal(all.isDataUnionProduct({}), false)
        })

        it('detects data union product from value', () => {
            assert.equal(all.isDataUnionProduct('DATAUNION'), true)
            assert.equal(all.isDataUnionProduct('NORMAL'), false)
        })

        it('detects data union product from empty value', () => {
            assert.equal(all.isDataUnionProduct(''), false)
            assert.equal(all.isDataUnionProduct(), false)
        })
    })

    describe('validateProductPriceCurrency', () => {
        it('detects a valid currency', () => {
            assert.doesNotThrow(() => all.validateProductPriceCurrency('DATA'))
            assert.doesNotThrow(() => all.validateProductPriceCurrency('USD'))
        })

        it('detects an invalid currency', () => {
            assert.throws(() => all.validateProductPriceCurrency(undefined))
            assert.throws(() => all.validateProductPriceCurrency(null))
            assert.throws(() => all.validateProductPriceCurrency('ETH'))
            assert.throws(() => all.validateProductPriceCurrency('ÖDD'))
        })
    })

    describe('validateApiProductPricePerSecond', () => {
        it('detects a valid PPS', () => {
            assert.doesNotThrow(() => all.validateApiProductPricePerSecond('0'))
            assert.doesNotThrow(() => all.validateApiProductPricePerSecond('1'))
            assert.doesNotThrow(() => all.validateApiProductPricePerSecond('0,00045'))
            assert.doesNotThrow(() => all.validateApiProductPricePerSecond(BN(0.000001231355)))
        })

        it('detects an invalid PPS', () => {
            assert.throws(() => all.validateApiProductPricePerSecond('-1'))
            assert.throws(() => all.validateApiProductPricePerSecond(BN(-0.000001231355)))
        })
    })

    describe('validateContractProductPricePerSecond', () => {
        it('detects a valid PPS', () => {
            assert.doesNotThrow(() => all.validateContractProductPricePerSecond('1'))
            assert.doesNotThrow(() => all.validateContractProductPricePerSecond('0,000125'))
            assert.doesNotThrow(() => all.validateContractProductPricePerSecond(BN(0.000001231355)))
        })

        it('detects an invalid PPS', () => {
            assert.throws(() => all.validateContractProductPricePerSecond('0'))
            assert.throws(() => all.validateContractProductPricePerSecond('-0.0001'))
            assert.throws(() => all.validateContractProductPricePerSecond(BN(-0.000001231355)))
        })
    })

    describe('mapPriceFromContract', () => {
        it('converts the price', () => {
            assert.equal(all.mapPriceFromContract('0,0000013314'), 'NaN')
            assert.equal(all.mapPriceFromContract('asdfasdf'), 'NaN')
            assert.equal(all.mapPriceFromContract('0'), '0')
            assert.equal(all.mapPriceFromContract('1000000000000000000'), '1')
            assert.equal(all.mapPriceFromContract('1'), '1e-18')
            assert.equal(all.mapPriceFromContract('-1'), '-1e-18')
        })
    })

    describe('mapPriceToContract', () => {
        it('converts the price', () => {
            assert.equal(all.mapPriceToContract('0,0000013314'), 'NaN')
            assert.equal(all.mapPriceToContract('asdfasdf'), 'NaN')
            assert.equal(all.mapPriceToContract('0'), '0')
            assert.equal(all.mapPriceToContract('1'), '1000000000000000000')
            assert.equal(all.mapPriceToContract('1e-18'), '1')
            assert.equal(all.mapPriceToContract('-1e-18'), '-1')
            assert.equal(all.mapPriceToContract('0.0000000000000000001'), '0')
            assert.equal(all.mapPriceToContract('0.00000000000000000049'), '0')
            assert.equal(all.mapPriceToContract('0.00000000000000000051'), '1')
            assert.equal(all.mapPriceToContract('66666666666666.00000000000123456789'), '66666666666666000000000001234568')
            assert.equal(all.mapPriceToContract('66666666666666.00000000000123456749'), '66666666666666000000000001234567')
        })
    })

    describe('mapPriceFromApi', () => {
        it('converts the price', () => {
            assert.equal(all.mapPriceFromApi('0,0000013314'), 'NaN')
            assert.equal(all.mapPriceFromApi('lorem impsum'), 'NaN')
            assert.equal(all.mapPriceFromApi('0'), '0')
            assert.equal(all.mapPriceFromApi('1000000000'), '1')
            assert.equal(all.mapPriceFromApi('1'), '1e-9')
            assert.equal(all.mapPriceFromApi('-1'), '-1e-9')
        })
    })

    describe('mapPriceToApi', () => {
        it('converts the price', () => {
            assert.equal(all.mapPriceToApi('0,0000013314'), 'NaN')
            assert.equal(all.mapPriceToApi('lorem impsum'), 'NaN')
            assert.equal(all.mapPriceToApi('0'), '0')
            assert.equal(all.mapPriceToApi('1'), '1000000000')
            assert.equal(all.mapPriceToApi('1e-9'), '1')
            assert.equal(all.mapPriceToApi('-1e-9'), '-1')
            assert.equal(all.mapPriceToApi('0.0000000001'), '0')
            assert.equal(all.mapPriceToApi('0.00000000049'), '0')
            assert.equal(all.mapPriceToApi('0.00000000051'), '1')
            assert.equal(all.mapPriceToApi('66666666666666.00123456789'), '66666666666666001234568')
            assert.equal(all.mapPriceToApi('66666666666666.00123456749'), '66666666666666001234567')
        })
    })

    describe('mapProductFromApi', () => {
        it('maps product properties', () => {
            const inProduct = {
                name: 'test',
                pricePerSecond: 1000000000,
            }
            const outProduct = {
                name: 'test',
                pricePerSecond: '1',
            }

            assert.deepStrictEqual(all.mapProductFromApi(inProduct), outProduct)
        })
    })

    describe('mapProductToPostApi', () => {
        it('maps product properties', () => {
            const inProduct = {
                name: 'test',
                pricePerSecond: 1,
                priceCurrency: 'DATA',
            }
            const outProduct = {
                name: 'test',
                pricePerSecond: '1000000000',
                priceCurrency: 'DATA',
            }

            assert.deepStrictEqual(all.mapProductToPostApi(inProduct), outProduct)
        })

        it('rejects invalid objects', () => {
            const inProduct = {
                name: 'test',
                pricePerSecond: 1,
                priceCurrency: 'EUR',
            }

            assert.throws(() => all.mapProductToPostApi(inProduct))
        })
    })

    describe('mapProductToPutApi', () => {
        it('returns the same object for unpaid product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                pricePerSecond: 0,
                state: productStates.DEPLOYED,
            }

            expect(all.mapProductToPutApi(product)).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                pricePerSecond: '0',
                state: productStates.DEPLOYED,
            })
        })

        it('maps price for unpublished paid product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                pricePerSecond: 1,
                beneficiaryAddress: '0x12334',
                isFree: false,
                state: productStates.NOT_DEPLOYED,
            }

            expect(all.mapProductToPutApi(product)).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                pricePerSecond: '1000000000',
                beneficiaryAddress: '0x12334',
                isFree: false,
                state: productStates.NOT_DEPLOYED,
            })
        })

        it('returns the pending changes for unpaid product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
                pendingChanges: {
                    name: 'Better name',
                },
            }

            expect(all.mapProductToPutApi(product)).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
                pendingChanges: {
                    name: 'Better name',
                },
            })
        })

        it('returns removes smart contract fields for published paid product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                ownerAddress: '0x1234',
                beneficiaryAddress: '0x1234',
                pricePerSecond: '12345',
                priceCurrency: 'USD',
                minimumSubscriptionInSeconds: 0,
                state: productStates.DEPLOYED,
            }

            expect(all.mapProductToPutApi(product)).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
            })
        })

        it('returns removes smart contract fields and returns pending changes for published paid product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                ownerAddress: '0x1234',
                beneficiaryAddress: '0x1234',
                pricePerSecond: '12345',
                priceCurrency: 'USD',
                minimumSubscriptionInSeconds: 0,
                state: productStates.DEPLOYED,
                pendingChanges: {
                    name: 'Better name',
                },
            }

            expect(all.mapProductToPutApi(product)).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
                pendingChanges: {
                    name: 'Better name',
                },
            })
        })
    })

    describe('mapProductFromContract', () => {
        it('maps product properties', () => {
            const inProduct = {
                id: 1,
                name: 'test',
                minimumSubscriptionSeconds: 60,
                pricePerSecond: 1,
                owner: '0x123',
                beneficiary: '0x1337',
                currency: 0,
                state: 0,
            }
            const outProduct = {
                id: 1,
                name: 'test',
                minimumSubscriptionInSeconds: 60,
                pricePerSecond: '1e-18',
                ownerAddress: '0x123',
                beneficiaryAddress: '0x1337',
                priceCurrency: 'DATA',
                state: 'NOT_DEPLOYED',
            }

            assert.deepStrictEqual(all.mapProductFromContract(inProduct.id, inProduct), outProduct)
        })
    })

    describe('isPublishedProduct', () => {
        it('returns status', () => {
            const prod1 = {
                state: 'NOT_DEPLOYED',
            }
            assert.equal(all.isPublishedProduct(prod1), false)

            const prod2 = {
                state: 'DEPLOYED',
            }
            assert.equal(all.isPublishedProduct(prod2), true)

            const prod3 = {
                state: 'DEPLOYING',
            }
            assert.equal(all.isPublishedProduct(prod3), false)

            const prod4 = {
                state: 'UNDEPLOYING',
            }
            assert.equal(all.isPublishedProduct(prod4), false)
        })
    })

    describe('getValidId', () => {
        describe('when prefix = true or missing', () => {
            it('works with a prefixed id', () => {
                assert.equal(all.getValidId('0x1234'), '0x1234')
                assert.equal(all.getValidId('0x1234', true), '0x1234')
            })
            it('works with an unprefixed id', () => {
                assert.equal(all.getValidId('1234'), '0x1234')
                assert.equal(all.getValidId('1234', true), '0x1234')
            })
            it('throws with an invalid id', () => {
                assert.throws(() => all.getValidId('test'), /is not a valid hex/)
                assert.throws(() => all.getValidId('test', true), /is not a valid hex/)
            })
        })
        describe('when prefix = false', () => {
            it('works with a prefixed id', () => {
                assert.equal(all.getValidId('0x1234', false), '1234')
            })
            it('works with an unprefixed id', () => {
                assert.equal(all.getValidId('1234', false), '1234')
            })
            it('throws with an invalid id', () => {
                assert.throws(() => all.getValidId('test', false), /is not a valid hex/)
            })
        })
    })
})
