import * as all from '~/marketplace/utils/validate'
import { validateSalePoint } from '~/marketplace/utils/validate'
import { MaxSearchPhraseLenght } from '~/consts'
import { ProjectType } from '~/shared/types'
import { SalePoint } from '~/marketplace/types/project-types'
import { toBN } from '~/utils/bn'

describe('validate utils', () => {
    describe('isValidSearchQuery', () => {
        it(`must limit the search character throughput to ${MaxSearchPhraseLenght} characters long`, () => {
            const goodSearch = 'Lorem ipsum dolor sit amet'
            const tooLongSearch = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Est placerat in egestas erat imperdiet sed euismod. Vitae proin sagittis nisl 
                rhoncus mattis. Ullamcorper morbi tincidunt ornare massa eget. Urna nec tincidunt praesent semper 
                feugiat nibh sed pulvinar. Quis varius quam quisque id diam vel quam elementum pulvinar. Praesent 
                tristique magna sit amet purus gravida. Condimentum mattis pellentesque id nibh tortor. Lectus urna 
                duis convallis convallis tellus id interdum velit. Ac ut consequat semper viverra. AdipiscingLorem 
                ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Est placerat in egestas erat imperdiet sed euismod. Vitae proin sagittis nisl 
                rhoncus mattis. Ullamcorper morbi tincidunt ornare massa eget. Urna nec tincidunt praesent semper 
                feugiat nibh sed pulvinar. Quis varius quam quisque id diam vel quam elementum pulvinar. Praesent 
                tristique magna sit amet purus gravida. Condimentum mattis pellentesque id nibh tortor. Lectus urna 
                duis convallis convallis tellus id interdum velit. Ac ut consequat semper viverra. Adipiscing
                rhoncus mattis. Ullamcorper morbi tincidunt ornare massa eget. Urna nec tincidunt praesent semper`
            expect(all.isValidSearchQuery(tooLongSearch)).toBe(false)
            expect(all.isValidSearchQuery(goodSearch)).toBe(true)
        })
    })

    describe('validateSalePoint', () => {
        const defaultSalePoint: SalePoint = {
            chainId: 12345,
            pricePerSecond: toBN('10'),
            pricingTokenAddress: '0xbAA81A0179015bE47Ad439566374F2Bae098686F',
            beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
            price: toBN('3600'),
            timeUnit: 'hour',
        }
        ;[
            {
                description: 'invalid pricePerSecond',
                project: {
                    projectType: ProjectType.PaidData,
                    salePoint: {
                        ...defaultSalePoint,
                        pricePerSecond: toBN('-10'),
                    },
                },
                expectedInvalidFields: ['pricePerSecond'],
            },
            {
                description: 'invalid beneficiaryAddress',
                project: {
                    projectType: ProjectType.PaidData,
                    salePoint: {
                        ...defaultSalePoint,
                        beneficiaryAddress: 'loremIpsum',
                    },
                },
                expectedInvalidFields: ['beneficiaryAddress'],
            },
            {
                description: 'invalid pricingTokenAddress',
                project: {
                    projectType: ProjectType.PaidData,
                    salePoint: {
                        ...defaultSalePoint,
                        pricingTokenAddress: '0xa3934kd',
                    },
                },
                expectedInvalidFields: ['pricingTokenAddress'],
            },
            {
                description: 'invalid chain',
                project: {
                    projectType: ProjectType.PaidData,
                    salePoint: {
                        ...defaultSalePoint,
                        chainId: undefined,
                    },
                },
                expectedInvalidFields: ['chainId'],
            },
            {
                description: 'invalid price',
                project: {
                    projectType: ProjectType.PaidData,
                    salePoint: {
                        ...defaultSalePoint,
                        price: toBN('0'),
                    },
                },
                expectedInvalidFields: ['price'],
            },
            {
                description: 'invalid timeUnit',
                project: {
                    projectType: ProjectType.PaidData,
                    salePoint: {
                        ...defaultSalePoint,
                        timeUnit: '5',
                    },
                },
                expectedInvalidFields: ['timeUnit'],
            },
            {
                description: 'invalid timeUnit AND pricingTokenAddress for a DU',
                project: {
                    projectType: ProjectType.DataUnion,
                    salePoint: {
                        ...defaultSalePoint,
                        timeUnit: '5',
                        beneficiaryAddress: undefined,
                        pricingTokenAddress: '1234',
                    },
                },
                expectedInvalidFields: ['timeUnit', 'pricingTokenAddress'],
            },
        ].forEach((testCase) => {
            it(`should properly validate the SalePoint's ${testCase.description}`, () => {
                expect(
                    all.validateSalePoint(
                        testCase.project.salePoint,
                        testCase.project.projectType === ProjectType.DataUnion,
                    ),
                ).toEqual(testCase.expectedInvalidFields)
            })
        })
    })
})
