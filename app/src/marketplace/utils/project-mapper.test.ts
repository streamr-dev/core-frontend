import BN from "bn.js"
import {TheGraphPaymentDetails, TheGraphProject} from "$app/src/services/projects"
import {mapGraphProjectToDomainModel, mapSalePoints} from "$mp/utils/project-mapper"
import {ProjectTypeEnum} from "$mp/utils/constants"

const stubChainName = 'localChain'

jest.mock('$shared/web3/config', () => ({
    getConfigForChain: jest.fn().mockImplementation((chainId) => ({id: chainId, name: stubChainName})),
    getConfigForChainByName: jest.fn().mockReturnValue({})
}))

jest.mock('$mp/utils/web3', () => ({
    getTokenInformation: jest.fn().mockImplementation(async () => {
        return {decimals: new BN(18)}
    })
}))

describe('projectMapper', () => {
    const paymentDetailsStub: TheGraphPaymentDetails[] = [
        {
            beneficiary: 'beneficiaryaddress',
            pricePerSecond: '324234234232323',
            pricingTokenAddress: 'tokenaddress',
            domainId: '666'
        }
    ]

    describe('mapSalePoints', () => {
        it('should map properly the salePoints', async () => {
            const salePoints = await mapSalePoints(paymentDetailsStub)
            expect(salePoints).toHaveProperty(stubChainName)
            expect(salePoints[stubChainName].chainId).toEqual(666)
            expect(salePoints[stubChainName].beneficiaryAddress).toEqual(paymentDetailsStub[0].beneficiary)
            expect(salePoints[stubChainName].pricingTokenAddress).toEqual(paymentDetailsStub[0].pricingTokenAddress)
            expect(salePoints[stubChainName].pricePerSecond.isEqualTo('0.000' + paymentDetailsStub[0].pricePerSecond)).toEqual(true)
            expect(salePoints[stubChainName].price).toEqual(expect.anything())
            expect(salePoints[stubChainName].timeUnit).toEqual(expect.any(String))
        })
    })

    describe('mapGraphProjectToDomainModel', () => {
        it('should mat the graph project to the domain model', async () => {
            const stubGraphModel: TheGraphProject = {
                id: '39393939',
                paymentDetails: paymentDetailsStub,
                streams: ['01010101'],
                metadata: {
                    name: 'lorem',
                    description: 'ipsum',
                    contactDetails: {},
                    imageUrl: 'https://example.com/image.jpg',
                    termsOfUse: {
                        commercialUse: false,
                        reselling: false,
                        redistribution: false,
                        storage: false,
                        termsName: undefined,
                        termsUrl: undefined
                    }
                },
                createdAt: 'xxx',
                updatedAt: 'xxx',
                purchases: [],
                permissions: [],
                purchasesCount: 0,
                minimumSubscriptionSeconds: '0',
                version: null,
                subscriptions: []
            }
            const model = await mapGraphProjectToDomainModel(stubGraphModel)
            expect(model).toMatchObject({
                id: stubGraphModel.id,
                type: ProjectTypeEnum.PAID_DATA,
                name: stubGraphModel.metadata.name,
                description: stubGraphModel.metadata.description,
                imageUrl: stubGraphModel.metadata.imageUrl,
                streams: stubGraphModel.streams,
                termsOfUse: stubGraphModel.metadata.termsOfUse,
                contact: stubGraphModel.metadata.contactDetails,
                salePoints: expect.anything() // because sale point mapping has it's own test
            })
        })
    })
})
