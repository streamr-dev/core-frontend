import BN from 'bignumber.js'
import * as all from '$mp/utils/product'
import { Project, SalePoint } from '$mp/types/project-types'
import { ProjectType } from '$shared/types'

describe('product utils', () => {
    describe('isPaidProduct', () => {
        it('detects a free product', () => {
            const product = {
                type: ProjectType.OpenData
            } as Project
            expect(all.isPaidProject(product)).toBe(false)
        })
        it('detects a paid product', () => {
            const product = {
                type: ProjectType.PaidData
            } as Project
            expect(all.isPaidProject(product)).toBe(true)
        })
    })
    describe('isDataUnionProduct', () => {
        it('detects data union product from object', () => {
            const product1 = {
                id: 'text',
                type: ProjectType.DataUnion,
            } as any
            expect(all.isDataUnionProduct(product1)).toBe(true)
            const product2 = {
                id: 'text',
                type: 'NORMAL',
            } as any
            expect(all.isDataUnionProduct(product2)).toBe(false)
        })
        it('detects data union product from empty object', () => {
            expect(all.isDataUnionProduct({} as any)).toBe(false)
        })
        it('detects data union product from value', () => {
            expect(all.isDataUnionProduct(ProjectType.DataUnion)).toBe(true)
            expect(all.isDataUnionProduct(ProjectType.PaidData)).toBe(false)
        })
    })
    describe('validateProductPriceCurrency', () => {
        it('detects a valid currency', () => {
            expect(() => all.validateProductPriceCurrency('DATA')).not.toThrow()
            expect(() => all.validateProductPriceCurrency('USD')).not.toThrow()
        })
        it('detects an invalid currency', () => {
            expect(() => all.validateProductPriceCurrency(undefined)).toThrow()
            expect(() => all.validateProductPriceCurrency(null)).toThrow()
            expect(() => all.validateProductPriceCurrency('ETH')).toThrow()
            expect(() => all.validateProductPriceCurrency('ÖDD')).toThrow()
        })
    })
    describe('validateApiProductPricePerSecond', () => {
        it('detects a valid PPS', () => {
            expect(() => all.validateApiProductPricePerSecond('0')).not.toThrow()
            expect(() => all.validateApiProductPricePerSecond('1')).not.toThrow()
            expect(() => all.validateApiProductPricePerSecond('0,00045')).not.toThrow()
            expect(() => all.validateApiProductPricePerSecond(new BN(0.000001231355))).not.toThrow()
        })
        it('detects an invalid PPS', () => {
            expect(() => all.validateApiProductPricePerSecond('-1')).toThrow()
            expect(() => all.validateApiProductPricePerSecond(new BN(-0.000001231355))).toThrow()
        })
    })
    describe('validateContractProductPricePerSecond', () => {
        it('detects a valid PPS', () => {
            expect(() => all.validateContractProductPricePerSecond('1')).not.toThrow()
            expect(() => all.validateContractProductPricePerSecond('0,000125')).not.toThrow()
            expect(() => all.validateContractProductPricePerSecond(new BN(0.000001231355))).not.toThrow()
        })
        it('detects an invalid PPS', () => {
            expect(() => all.validateContractProductPricePerSecond('0')).toThrow()
            expect(() => all.validateContractProductPricePerSecond('-0.0001')).toThrow()
            expect(() => all.validateContractProductPricePerSecond(new BN(-0.000001231355))).toThrow()
        })
    })
    describe('mapPriceFromContract', () => {
        it('converts the price', () => {
            expect(all.mapPriceFromContract('0,0000013314', new BN(18))).toBe('NaN')
            expect(all.mapPriceFromContract('asdfasdf', new BN(18))).toBe('NaN')
            expect(all.mapPriceFromContract('0', new BN(18))).toBe('0')
            expect(all.mapPriceFromContract('1000000000000000000', new BN(18))).toBe('1')
            expect(all.mapPriceFromContract('1', new BN(18))).toBe('1e-18')
            expect(all.mapPriceFromContract('-1', new BN(18))).toBe('-1e-18')
        })
    })
    describe('mapPriceToContract', () => {
        it('converts the price', () => {
            expect(all.mapPriceToContract('0,0000013314', new BN(18))).toBe('NaN')
            expect(all.mapPriceToContract('asdfasdf', new BN(18))).toBe('NaN')
            expect(all.mapPriceToContract('0', new BN(18))).toBe('0')
            expect(all.mapPriceToContract('1', new BN(18))).toBe('1000000000000000000')
            expect(all.mapPriceToContract('1e-18', new BN(18))).toBe('1')
            expect(all.mapPriceToContract('-1e-18', new BN(18))).toBe('-1')
            expect(all.mapPriceToContract('0.0000000000000000001', new BN(18))).toBe('0')
            expect(all.mapPriceToContract('0.00000000000000000049', new BN(18))).toBe('0')
            expect(all.mapPriceToContract('0.00000000000000000051', new BN(18))).toBe('1')
            expect(all.mapPriceToContract('66666666666666.00000000000123456789', new BN(18))).toBe(
                '66666666666666000000000001234568',
            )
            expect(all.mapPriceToContract('66666666666666.00000000000123456749', new BN(18))).toBe(
                '66666666666666000000000001234567',
            )
        })
    })
    describe('mapProductFromContract', () => {
        it('maps product properties', () => {
            const inProduct = {
                id: 1,
                name: 'test',
                minimumSubscriptionSeconds: 60,
                pricePerSecond: '1',
                owner: '0x123',
                beneficiary: '0x1337',
                currency: 0,
                state: 0,
                pricingTokenAddress: '0x1337',
            } as any
            const outProduct = {
                id: 1,
                name: 'test',
                minimumSubscriptionInSeconds: 60,
                pricePerSecond: '1',
                ownerAddress: '0x123',
                beneficiaryAddress: '0x1337',
                state: 'NOT_DEPLOYED',
                pricingTokenAddress: '0x1337',
                pricingTokenDecimals: 18,
                chainId: 1337,
            }
            expect(all.mapProductFromContract(inProduct.id, inProduct, 1337, new BN(18))).toMatchObject(outProduct)
        })
    })
    describe('getValidId', () => {
        describe('when prefix = true or missing', () => {
            it('works with a prefixed id', () => {
                expect(all.getValidId('0x1234')).toBe('0x1234')
                expect(all.getValidId('0x1234', true)).toBe('0x1234')
            })
            it('works with an unprefixed id', () => {
                expect(all.getValidId('1234')).toBe('0x1234')
                expect(all.getValidId('1234', true)).toBe('0x1234')
            })
            it('throws with an invalid id', () => {
                expect(() => all.getValidId('test')).toThrowError(/is not a valid hex/)
                expect(() => all.getValidId('test', true)).toThrowError(/is not a valid hex/)
            })
        })
        describe('when prefix = false', () => {
            it('works with a prefixed id', () => {
                expect(all.getValidId('0x1234', false)).toBe('1234')
            })
            it('works with an unprefixed id', () => {
                expect(all.getValidId('1234', false)).toBe('1234')
            })
            it('throws with an invalid id', () => {
                expect(() => all.getValidId('test', false)).toThrowError(/is not a valid hex/)
            })
        })
    })
    describe('validate', () => {
        it('validates empty product free data product', () => {
            expect(
                all.validate({
                    type: ProjectType.OpenData,
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
            })
        })
        it('validates empty product paid data product', () => {
            expect(
                all.validate({
                    type: ProjectType.PaidData,
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                salePoints: true,
            })
        })
        it('validates empty product paid data union', () => {
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    isDeployingNewDU: true,
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: true,
                dataUnionChainId: true,
                salePoints: true,
                existingDUAddress: false,
            })
        })
        it('validates name & description', () => {
            expect(
                all.validate({
                    type: ProjectType.OpenData,
                    name: 'new name',
                    description: 'new description',
                } as Project),
            ).toStrictEqual({
                name: false,
                description: false,
                creator: true,
                imageUrl: true,
                streams: true,
            })
        })
        it('validates creator name', () => {
            expect(
                all.validate({
                    type: ProjectType.OpenData,
                    creator: 'Julius Cesar'
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                imageUrl: true,
                streams: true,
            })
        })
        it('validates image', () => {
            expect(
                all.validate({
                    type: ProjectType.OpenData,
                    imageUrl: 'http://...',
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: false,
                streams: true,
            })
            expect(
                all.validate({
                    type: ProjectType.OpenData,
                    newImageToUpload: new File(['loremipsum'], 'foobar'),
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: false,
                streams: true,
            })
        })
        it('validates streams', () => {
            expect(
                all.validate({
                    type: ProjectType.OpenData,
                    streams: ['1', '2'],
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: false,
            })
        })
        it('validates data union required fields', () => {
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    adminFee: '0.3',
                    dataUnionChainId: 123
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: false,
                dataUnionChainId: false,
                salePoints: true,
                existingDUAddress: true
            })
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    adminFee: '0',
                    dataUnionChainId: 123
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: false,
                dataUnionChainId: false,
                salePoints: true,
                existingDUAddress: true
            })
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    adminFee: '1.1',
                    dataUnionChainId: null
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: false,
                dataUnionChainId: true,
                salePoints: true,
                existingDUAddress: true
            })
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    adminFee: '0.5',
                    dataUnionChainId: 124,
                    isDeployingNewDU: true
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: false,
                dataUnionChainId: false,
                salePoints: true,
                existingDUAddress: false,
            })
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    adminFee: '0.5',
                    dataUnionChainId: 124,
                    isDeployingNewDU: false,
                    existingDUAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: false,
                dataUnionChainId: false,
                salePoints: true,
                existingDUAddress: false
            })
            expect(
                all.validate({
                    type: ProjectType.DataUnion,
                    adminFee: '0.5',
                    dataUnionChainId: 124,
                    isDeployingNewDU: false,
                    existingDUAddress: 'invalidAddress'
                } as Project),
            ).toStrictEqual({
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
                adminFee: false,
                dataUnionChainId: false,
                salePoints: true,
                existingDUAddress: true
            })
        })

        describe('sale points', () => {
            const expectedValidationResult = {
                name: true,
                description: true,
                creator: true,
                imageUrl: true,
                streams: true,
            }
            const defaultSalePointChainName = 'polygon'
            const defaultSalePoint: SalePoint = {
                chainId: 12345,
                pricePerSecond: new BN('10'),
                pricingTokenAddress: '0xbAA81A0179015bE47Ad439566374F2Bae098686F',
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                price: new BN('3600'),
                timeUnit: 'hour'
            };
            [
                {
                    description: 'invalid pricePerSecond',
                    project: {
                        type: ProjectType.PaidData,
                        salePoints: {
                            [defaultSalePointChainName] : {
                                ...defaultSalePoint,
                                pricePerSecond: new BN('-10')
                            }
                        }
                    },
                    expectedInvalidField: 'pricePerSecond'
                },
                {
                    description: 'invalid beneficiaryAddress',
                    project: {
                        type: ProjectType.PaidData,
                        salePoints: {
                            [defaultSalePointChainName] : {
                                ...defaultSalePoint,
                                beneficiaryAddress: 'loremIpsum'
                            }
                        }
                    },
                    expectedInvalidField: 'beneficiaryAddress'
                }
            ].forEach((testCase) => {
                it(`should properly validate the ${testCase.description}`, () => {
                    expect(all.validate(testCase.project as unknown as Project)).toStrictEqual({
                        ...expectedValidationResult,
                        [`salePoints.${defaultSalePointChainName}`]: true
                    })
                })
            })
        })
    })
})
