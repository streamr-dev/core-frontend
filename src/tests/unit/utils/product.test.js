import assert from 'assert-diff'
import BN from 'bignumber.js'

import * as all from '../../../utils/product'

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

    describe('validateProductId', () => {
        it('detects a valid id', () => {
            assert.doesNotThrow(() => all.validateProductId('12345', false))
            assert.doesNotThrow(() => all.validateProductId('deadbeef', false))
            assert.doesNotThrow(() => all.validateProductId('0x12345', true))
            assert.doesNotThrow(() => all.validateProductId('0xcafebabe', true))
        })

        it('detects an invalid id', () => {
            assert.throws(() => all.validateProductId(undefined))
            assert.throws(() => all.validateProductId(null))
            assert.throws(() => all.validateProductId('öööö', false))
            assert.throws(() => all.validateProductId('0xöööö', true))
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

            assert.deepEqual(all.mapProductFromApi(inProduct), outProduct)
        })
    })

    describe('mapProductToApi', () => {
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

            assert.deepEqual(all.mapProductToApi(inProduct), outProduct)
        })

        it('rejects invalid objects', () => {
            const inProduct = {
                name: 'test',
                pricePerSecond: 1,
                priceCurrency: 'EUR',
            }

            assert.throws(() => all.mapProductToApi(inProduct))
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
                currency: 'USD',
                state: 'DEPLOYED',
            }
            const outProduct = {
                id: 1,
                name: 'test',
                minimumSubscriptionInSeconds: 60,
                pricePerSecond: '1e-18',
                ownerAddress: '0x123',
                beneficiaryAddress: '0x1337',
                priceCurrency: 'USD',
                state: 'DEPLOYED',
            }

            assert.deepEqualOrig(all.mapProductFromContract(inProduct.id, inProduct), outProduct)
        })
    })

    describe('isPaidAndNotPublishedProduct', () => {
        it('returns status', () => {
            const prod1 = {
                isFree: false,
                state: 'NOT_DEPLOYED',
            }
            assert.equal(all.isPaidAndNotPublishedProduct(prod1), true)

            const prod2 = {
                isFree: false,
                state: 'DEPLOYED',
            }
            assert.equal(all.isPaidAndNotPublishedProduct(prod2), false)

            const prod3 = {
                isFree: true,
                state: 'DEPLOYED',
            }
            assert.equal(all.isPaidAndNotPublishedProduct(prod3), false)

            const prod4 = {
                isFree: true,
                state: 'NOT_DEPLOYED',
            }
            assert.equal(all.isPaidAndNotPublishedProduct(prod4), false)
        })
    })
})
