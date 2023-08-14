import BN from 'bn.js'
import { TheGraphPaymentDetails, TheGraphProject } from '~/services/projects'
import {
    mapGraphProjectToDomainModel,
    mapSalePoints,
} from '~/marketplace/utils/project-mapper'
import { ProjectType } from '~/shared/types'
import getCoreConfig from '~/getters/getCoreConfig'

const stubChainName = 'localChain'

jest.mock('~/shared/web3/config', () => ({
    getConfigForChain: jest
        .fn()
        .mockImplementation((chainId) => ({ id: chainId, name: stubChainName })),
    getConfigForChainByName: jest.fn().mockReturnValue({}),
}))

jest.mock('~/hooks/useTokenInfo', () => ({
    getTokenInfo: jest.fn().mockImplementation(async () => {
        return { decimals: new BN(18) }
    }),
}))

describe('projectMapper', () => {
    const paymentDetailsStub: TheGraphPaymentDetails[] = [
        {
            beneficiary: 'beneficiaryaddress',
            pricePerSecond: '324234234232323',
            pricingTokenAddress: 'tokenaddress',
            domainId: '666',
        },
    ]

    describe('mapSalePoints', () => {
        it('should map properly the salePoints', async () => {
            const salePoints = await mapSalePoints(paymentDetailsStub)
            expect(salePoints).toHaveProperty(stubChainName)
            expect(salePoints[stubChainName].chainId).toEqual(666)
            expect(salePoints[stubChainName].beneficiaryAddress).toEqual(
                paymentDetailsStub[0].beneficiary,
            )
            expect(salePoints[stubChainName].pricingTokenAddress).toEqual(
                paymentDetailsStub[0].pricingTokenAddress,
            )
            expect(
                salePoints[stubChainName].pricePerSecond.isEqualTo(
                    paymentDetailsStub[0].pricePerSecond,
                ),
            ).toEqual(true)
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
                    creator: 'Satoshi Nakamoto',
                    contactDetails: {},
                    imageIpfsCid: 'IPFS_ID',
                    termsOfUse: {
                        commercialUse: false,
                        reselling: false,
                        redistribution: false,
                        storage: false,
                        termsName: undefined,
                        termsUrl: undefined,
                    },
                },
                isDataUnion: false,
                createdAt: 'xxx',
                updatedAt: 'xxx',
                purchases: [],
                permissions: [],
                purchasesCount: 0,
                minimumSubscriptionSeconds: '0',
                version: null,
            }
            const model = await mapGraphProjectToDomainModel(stubGraphModel)

            const { ipfs } = getCoreConfig()
            const { ipfsGatewayUrl } = ipfs

            expect(model).toMatchObject({
                id: stubGraphModel.id,
                type: ProjectType.PaidData,
                name: stubGraphModel.metadata.name,
                description: stubGraphModel.metadata.description,
                creator: stubGraphModel.metadata.creator,
                imageUrl: ipfsGatewayUrl + stubGraphModel.metadata.imageIpfsCid,
                streams: stubGraphModel.streams,
                termsOfUse: stubGraphModel.metadata.termsOfUse,
                contact: stubGraphModel.metadata.contactDetails,
                salePoints: expect.anything(), // because sale point mapping has it's own test
            })
        })
    })
})
