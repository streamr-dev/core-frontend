import {TheGraphPaymentDetails, TheGraphProject} from "$app/src/services/projects"
import {mapGraphProjectToDomainModel, mapSalePoints} from "$mp/utils/project-mapper"
import {ProjectTypeEnum} from "$mp/utils/constants"

const stubChainName = 'localChain'

jest.mock('$shared/web3/config', () => ({
    getConfigForChain: jest.fn().mockImplementation((chainId) => ({id: chainId, name: stubChainName})),
    getConfigForChainByName: jest.fn().mockReturnValue({})
}))

describe('projectMapper', () => {
    const paymentDetailsStub: TheGraphPaymentDetails[] = [
        {
            beneficiary: 'beneficiaryaddress',
            pricePerSecond: '0.324234234',
            pricingTokenAddress: 'tokenaddress',
            domainId: '666'
        }
    ]

    describe('mapSalePoints', () => {
        it('should map properly the salePoints', () => {
            const salePoints = mapSalePoints(paymentDetailsStub)
            expect(salePoints).toStrictEqual({
                [stubChainName]: expect.objectContaining({
                    chainId: 666,
                    beneficiaryAddress: paymentDetailsStub[0].beneficiary,
                    pricingTokenAddress: paymentDetailsStub[0].pricingTokenAddress,
                    pricePerSecond: paymentDetailsStub[0].pricePerSecond,
                })
            })
        })
    })

    describe('mapGraphProjectToDomainModel', () => {
        it('should mat the graph project to the domain model', () => {
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
            const model = mapGraphProjectToDomainModel(stubGraphModel)
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
