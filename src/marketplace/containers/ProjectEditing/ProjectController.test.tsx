import React from 'react'
import BN from 'bignumber.js'
import { act, render } from '@testing-library/react'
import { isHex, randomHex } from 'web3-utils'
import { Chain } from '@streamr/config'
import { Project } from '~/marketplace/types/project-types'
import * as validationCtx from '~/marketplace/containers/ProductController/ValidationContextProvider'
import {
    createProject,
    SmartContractProjectCreate,
    updateProject,
} from '~/services/projects'
import { useProjectState } from '~/marketplace/contexts/ProjectStateContext'
import { ProjectType } from '~/shared/types'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { ObjectPaths } from '~/utils/objectPaths'
import { ProjectController, useProjectController } from './ProjectController'
import Mock = jest.Mock

const STUB_REGISTRY_CHAIN: Partial<Chain> = {
    id: defaultChainConfig.id,
    name: 'TestChain',
}
const STUB_DATA_TOKEN_ADDRESS = '0x3a9A81d576d83FF21f26f325066054540720fC34'
const STUB_UPLOADED_IMAGE_CID = 'IPFS_CID'

jest.mock('~/shared/web3/config', () => ({
    getConfigForChain: () => STUB_REGISTRY_CHAIN,
}))

jest.mock('~/marketplace/utils/web3', () => ({
    getDataAddress: () => STUB_DATA_TOKEN_ADDRESS,
}))

jest.mock('~//services/images', () => ({
    postImage: async () => STUB_UPLOADED_IMAGE_CID,
}))

jest.mock('~//services/projects', () => ({
    createProject: jest.fn(),
    updateProject: jest.fn(),
}))

jest.mock('~/marketplace/contexts/ProjectStateContext', () => ({
    useProjectState: jest.fn(),
}))

jest.mock('~/marketplace/containers/ProductController/useEditableProjectActions', () => ({
    useEditableProjectActions: () => ({
        updateExistingDUAddress: jest.fn(),
    }),
}))

jest.mock('~/shared/utils/constants', () => ({}))

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}))

jest.mock('~/routes', () => ({
    __esModule: true,
    default: {
        projects: {
            index: jest.fn(() => 'projects'),
        },
    },
}))

const PROJECT_STUB: Project = {
    id: undefined,
    newImageToUpload: new File([], 'testimage.jpg'),
    name: 'TestProject',
    description: 'Lorem ipsum dolor sit amet',
    creator: 'John Doe',
    contact: {
        email: 'john@doe.com',
        url: 'https://localhost.com',
        linkedIn: 'https://linked.in',
        reddit: 'https://reddit.com',
        twitter: 'https://twitter.com',
        telegram: 'https://telegram.com',
    },
    type: ProjectType.PaidData,
    salePoints: {
        polygon: {
            chainId: 1,
            beneficiaryAddress: randomHex(32),
            pricingTokenAddress: STUB_DATA_TOKEN_ADDRESS,
            price: new BN('2000'),
            pricePerSecond: new BN('5555555555556'),
            timeUnit: 'hour',
        },
    },
    streams: ['stream1', 'stream2'],
    termsOfUse: {
        commercialUse: true,
        redistribution: false,
        reselling: false,
        storage: false,
        termsName: 'Lorem ipsum terms',
        termsUrl: 'https://example.com',
    },
}

describe('ProjectController', () => {
    let controller: ProjectController

    const prepareTestForProjectCreate = (
        createProjectResult: boolean,
        validationResult: Partial<
            Record<
                ObjectPaths<Project>,
                { level: validationCtx.SeverityLevel; message: string }
            >
        >,
        state: Project,
    ) => {
        ;(createProject as Mock).mockReset()
        ;(useProjectState as Mock).mockReset()
        ;(createProject as Mock).mockImplementation(
            () =>
                new Promise<void>((resolve, reject) => {
                    createProjectResult ? resolve() : reject()
                }),
        )
        jest.spyOn(validationCtx, 'useValidationContext').mockImplementation(
            () =>
                ({
                    validate: () => validationResult,
                } as any),
        )
        ;(useProjectState as Mock).mockImplementation(() => ({
            state,
            updateState: () => {},
        }))
        const Component = () => {
            controller = useProjectController()
            return <></>
        }
        render(<Component />)
    }

    const prepareTestForProjectUpdate = (
        updateProjectResult: boolean,
        validationResult: Partial<
            Record<
                ObjectPaths<Project>,
                { level: validationCtx.SeverityLevel; message: string }
            >
        >,
        state: Project,
    ) => {
        ;(updateProject as Mock).mockReset()
        ;(useProjectState as Mock).mockReset()
        ;(updateProject as Mock).mockImplementation(
            () =>
                new Promise<void>((resolve, reject) => {
                    updateProjectResult ? resolve() : reject()
                }),
        )
        jest.spyOn(validationCtx, 'useValidationContext').mockImplementation(
            () =>
                ({
                    validate: () => validationResult,
                } as any),
        )
        ;(useProjectState as Mock).mockImplementation(() => ({
            state,
            updateState: () => {},
        }))
        const Component = () => {
            controller = useProjectController()
            return <></>
        }
        render(<Component />)
    }

    it('should create a project with proper data ', async () => {
        prepareTestForProjectCreate(true, {}, PROJECT_STUB)
        let result = false

        await act(async () => {
            try {
                await controller.create()
                result = true
            } catch (e) {
                // Do nothing.
            }
        })

        expect(result).toBe(true)
        expect(createProject).toHaveBeenCalledWith(
            expect.objectContaining({
                isPublicPurchasable: true,
                chainId: STUB_REGISTRY_CHAIN.id,
                id: expect.any(String),
                minimumSubscriptionInSeconds: 0,
                paymentDetails: [
                    {
                        chainId: PROJECT_STUB.salePoints['polygon'].chainId,
                        beneficiaryAddress:
                            PROJECT_STUB.salePoints['polygon'].beneficiaryAddress,
                        pricePerSecond: PROJECT_STUB.salePoints['polygon'].pricePerSecond,
                        pricingTokenAddress:
                            PROJECT_STUB.salePoints['polygon'].pricingTokenAddress,
                    },
                ],
            }),
        )
        const expectedMetadata = {
            name: PROJECT_STUB.name,
            description: PROJECT_STUB.description,
            creator: PROJECT_STUB.creator,
            imageIpfsCid: STUB_UPLOADED_IMAGE_CID,
            contactDetails: {
                email: PROJECT_STUB.contact.email,
                url: PROJECT_STUB.contact.url,
                twitter: PROJECT_STUB.contact.twitter,
                telegram: PROJECT_STUB.contact.telegram,
                reddit: PROJECT_STUB.contact.reddit,
                linkedIn: PROJECT_STUB.contact.linkedIn,
            },
            termsOfUse: { ...PROJECT_STUB.termsOfUse },
            isDataUnion: false,
        }
        const argument = (createProject as Mock).mock
            .lastCall[0] as SmartContractProjectCreate
        const argumentMetadata = JSON.parse(argument.metadata)
        expect(argumentMetadata).toEqual(expectedMetadata)
        expect(isHex(argument.id)).toEqual(true)
    })

    it('should not call createProject function, when some field is invalid and error notifications should be displayed', async () => {
        const errorText = 'Invalid project name'
        prepareTestForProjectCreate(
            true,
            { name: { level: validationCtx.SeverityLevel.ERROR, message: errorText } },
            { ...PROJECT_STUB },
        )
        let result: boolean | undefined

        let messages: string[] = []

        await act(async () => {
            try {
                await controller.create()
            } catch (e) {
                messages = e.messages
                result = false
            }
        })

        expect(result).toBe(false)
        expect(createProject).not.toHaveBeenCalled()
        expect(messages[0]).toEqual(errorText)
    })

    it('should display an error notification when an error occurs while publishing', async () => {
        prepareTestForProjectCreate(false, {}, { ...PROJECT_STUB })
        let result: boolean | undefined

        await act(async () => {
            try {
                await controller.create()
            } catch (e) {
                result = false
            }
        })

        expect(result).toBe(false)
        expect(createProject).toHaveBeenCalled()
    })

    it('should update a project ', async () => {
        const stubProjectId = '1234'
        prepareTestForProjectUpdate(true, {}, { ...PROJECT_STUB, id: stubProjectId })
        let result = false

        await act(async () => {
            try {
                await controller.update()
                result = true
            } catch (e) {
                // Do nothing.
            }
        })

        expect(result).toBe(true)
        expect(updateProject).toHaveBeenCalledWith(
            expect.objectContaining({
                chainId: STUB_REGISTRY_CHAIN.id,
                id: stubProjectId,
                minimumSubscriptionInSeconds: 0,
                paymentDetails: [
                    {
                        chainId: PROJECT_STUB.salePoints['polygon'].chainId,
                        beneficiaryAddress:
                            PROJECT_STUB.salePoints['polygon'].beneficiaryAddress,
                        pricePerSecond: PROJECT_STUB.salePoints['polygon'].pricePerSecond,
                        pricingTokenAddress:
                            PROJECT_STUB.salePoints['polygon'].pricingTokenAddress,
                    },
                ],
            }),
        )
        const expectedMetadata = {
            name: PROJECT_STUB.name,
            description: PROJECT_STUB.description,
            imageIpfsCid: STUB_UPLOADED_IMAGE_CID,
            creator: PROJECT_STUB.creator,
            contactDetails: {
                email: PROJECT_STUB.contact.email,
                url: PROJECT_STUB.contact.url,
                twitter: PROJECT_STUB.contact.twitter,
                telegram: PROJECT_STUB.contact.telegram,
                reddit: PROJECT_STUB.contact.reddit,
                linkedIn: PROJECT_STUB.contact.linkedIn,
            },
            termsOfUse: { ...PROJECT_STUB.termsOfUse },
            isDataUnion: false,
        }
        const argument = (createProject as Mock).mock
            .lastCall[0] as SmartContractProjectCreate
        const argumentMetadata = JSON.parse(argument.metadata)
        expect(argumentMetadata).toEqual(expectedMetadata)
        expect(isHex(argument.id)).toEqual(true)
    })
})
