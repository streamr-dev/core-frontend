import React from "react"
import BN from "bignumber.js"
import {act, render} from "@testing-library/react"
import {isHex, randomHex} from "web3-utils"
import {Chain} from "@streamr/config"
import {RecursiveKeyOf} from "$utils/recursiveKeyOf"
import {Project} from "$mp/types/project-types"
import * as validationCtx from "$mp/containers/ProductController/ValidationContextProvider"
import {createProject, SmartContractProjectCreate, updateProject} from "$app/src/services/projects"
import {useProjectState} from "$mp/contexts/ProjectStateContext"
import Notification from '$shared/utils/Notification'
import {ProjectTypeEnum} from "$mp/utils/constants"
import {NotificationIcon} from "$shared/utils/constants"
import {PersistOperation} from "$shared/types/common-types"
import {useProjectEditorStore} from "$mp/containers/ProjectEditing/proejctEditor.state"
import {ProjectController, useProjectController} from "./ProjectController"
import Mock = jest.Mock

const STUB_REGISTRY_CHAIN: Partial<Chain> = {
    id: 420,
    name: 'TestChain',
}
const STUB_DATA_TOKEN_ADDRESS = '0x3a9A81d576d83FF21f26f325066054540720fC34'
const STUB_UPLOADED_IMAGE_CID = 'IPFS_CID'

jest.mock('$shared/web3/config', () =>({
    getConfigForChain: () => STUB_REGISTRY_CHAIN
}))

jest.mock('$mp/utils/web3', () => ({
    getDataAddress: () => STUB_DATA_TOKEN_ADDRESS
}))

jest.mock('$app/src/services/images', () => ({
    postImage: async () => STUB_UPLOADED_IMAGE_CID
}))

jest.mock('$app/src/getters/getCoreConfig', () => ({
    __esModule: true,
    default: () => ({projectRegistry: {chainId: 1}})
}))

jest.mock('$shared/utils/Notification', () => ({
    __esModule: true,
    default: {
        push: jest.fn()
    }
}))

jest.mock('$app/src/services/projects', () => ({
    createProject: jest.fn(),
    updateProject: jest.fn()
}))

jest.mock('$mp/contexts/ProjectStateContext', () => ({
    useProjectState: jest.fn()
}))

jest.mock('$shared/utils/constants', () => ({
    NotificationIcon: {
        CHECKMARK: 'checkmark',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',
        SPINNER: 'spinner',
    }
}))

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn().mockReturnValue({push: jest.fn()})
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
        telegram: 'https://telegram.com'
    },
    type: ProjectTypeEnum.PAID_DATA,
    salePoints: {
        'polygon': {
            chainId: 1,
            beneficiaryAddress: randomHex(32),
            pricingTokenAddress: STUB_DATA_TOKEN_ADDRESS,
            price: new BN('2000'),
            pricePerSecond: new BN('5555555555556'),
            timeUnit: 'hour'
        }
    },
    streams: ['stream1', 'stream2'],
    termsOfUse: {
        commercialUse: true,
        redistribution: false,
        reselling: false,
        storage: false,
        termsName: 'Lorem ipsum terms',
        termsUrl: 'https://example.com'
    }
}

describe('ProjectController', () => {
    let controller: ProjectController
    let persistOperations: PersistOperation[] = []

    const prepareTestForProjectCreate = (
        createProjectResult: boolean,
        validationResult: Partial<Record<RecursiveKeyOf<Project>, {level: validationCtx.SeverityLevel, message: string}>>,
        state: Project,
    ) => {
        persistOperations = [];
        (createProject as Mock).mockReset();
        (useProjectState as Mock).mockReset();
        (createProject as Mock).mockImplementation(() => ({
            onTransactionComplete: ((cb: () => void) => {
                if (createProjectResult === true) {
                    cb()
                }
            }),
            onError: ((cb: () => void) => {
                if (createProjectResult === false) {
                    cb()
                }
            })
        } as any))
        jest.spyOn(validationCtx, 'useValidationContext').mockImplementation(() => ({
            validate: () => validationResult
        }) as any);
        (useProjectState as Mock).mockImplementation(() => ({state, updateState: () => {}}))
        const Component = () => {
            controller = useProjectController()
            persistOperations = useProjectEditorStore((state) => state.persistOperations)
            return <></>
        }
        render(<Component/>)
    }

    const prepareTestForProjectUpdate = (
        updateProjectResult: boolean,
        validationResult: Partial<Record<RecursiveKeyOf<Project>, {level: validationCtx.SeverityLevel, message: string}>>,
        state: Project,
    ) => {
        persistOperations = [];
        (updateProject as Mock).mockReset();
        (useProjectState as Mock).mockReset();
        (updateProject as Mock).mockImplementation(() => ({
            onTransactionComplete: ((cb: () => void) => {
                if (updateProjectResult === true) {
                    cb()
                }
            }),
            onError: ((cb: () => void) => {
                if (updateProjectResult === false) {
                    cb()
                }
            })
        } as any))
        jest.spyOn(validationCtx, 'useValidationContext').mockImplementation(() => ({
            validate: () => validationResult
        }) as any);
        (useProjectState as Mock).mockImplementation(() => ({state, updateState: () => {}}))
        const Component = () => {
            controller = useProjectController()
            persistOperations = useProjectEditorStore((state) => state.persistOperations)
            return <></>
        }
        render(<Component/>)
    }

    it('should create a project with proper data ', async () => {
        prepareTestForProjectCreate(true, {}, PROJECT_STUB)
        let result: boolean
        await act(async () => {
            result = await controller.create()
        })
        expect(result).toBe(true)
        expect(createProject).toHaveBeenCalledWith(expect.objectContaining({
            isPublicPurchasable: true,
            chainId: STUB_REGISTRY_CHAIN.id,
            id: expect.any(String),
            minimumSubscriptionInSeconds: 0,
            paymentDetails: [{
                chainId: PROJECT_STUB.salePoints['polygon'].chainId,
                beneficiaryAddress: PROJECT_STUB.salePoints['polygon'].beneficiaryAddress,
                pricePerSecond: PROJECT_STUB.salePoints['polygon'].pricePerSecond,
                pricingTokenAddress: PROJECT_STUB.salePoints['polygon'].pricingTokenAddress
            }]
        }))
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
                linkedIn: PROJECT_STUB.contact.linkedIn
            },
            termsOfUse: {...PROJECT_STUB.termsOfUse},
        }
        const argument = (createProject as Mock).mock.lastCall[0] as SmartContractProjectCreate
        const argumentMetadata = JSON.parse(argument.metadata)
        expect(argumentMetadata).toEqual(expectedMetadata)
        expect(isHex(argument.id)).toEqual(true)
        expect(persistOperations.length).toEqual(1)
        expect(persistOperations[0].state).toEqual('complete')
    })

    it('should not call createProject function, when some field is invalid and error notifications should be displayed', async () => {
        const errorText = 'Invalid project name'
        prepareTestForProjectCreate(true, {name: {level: validationCtx.SeverityLevel.ERROR, message: errorText}}, {...PROJECT_STUB})
        let result: boolean
        await act(async () => {
            result = await controller.create()
        })
        expect(result).toBe(false)
        expect(createProject).not.toHaveBeenCalled()
        expect(Notification.push).toHaveBeenCalledWith({
            title: errorText,
            icon: NotificationIcon.ERROR,
        })
    })

    it('should display an error notification when an error occurs while publishing', async () => {
        prepareTestForProjectCreate(false, {}, {...PROJECT_STUB})
        let result: boolean
        await act(async () => {
            result = await controller.create()
        })
        expect(result).toBe(false)
        expect(createProject).toHaveBeenCalled()
        expect(persistOperations.length).toEqual(1)
        expect(persistOperations[0].state).toEqual('error')
    })

    it('should update a project ', async () => {
        const stubProjectId = '1234'
        prepareTestForProjectUpdate(true, {}, {...PROJECT_STUB, id: stubProjectId})
        let result: boolean
        await act(async () => {
            result = await controller.update()
        })
        expect(result).toBe(true)
        expect(updateProject).toHaveBeenCalledWith(expect.objectContaining({
            chainId: STUB_REGISTRY_CHAIN.id,
            id: stubProjectId,
            minimumSubscriptionInSeconds: 0,
            paymentDetails: [{
                chainId: PROJECT_STUB.salePoints['polygon'].chainId,
                beneficiaryAddress: PROJECT_STUB.salePoints['polygon'].beneficiaryAddress,
                pricePerSecond: PROJECT_STUB.salePoints['polygon'].pricePerSecond,
                pricingTokenAddress: PROJECT_STUB.salePoints['polygon'].pricingTokenAddress
            }]
        }))
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
                linkedIn: PROJECT_STUB.contact.linkedIn
            },
            termsOfUse: {...PROJECT_STUB.termsOfUse},
        }
        const argument = (createProject as Mock).mock.lastCall[0] as SmartContractProjectCreate
        const argumentMetadata = JSON.parse(argument.metadata)
        expect(argumentMetadata).toEqual(expectedMetadata)
        expect(isHex(argument.id)).toEqual(true)
        expect(persistOperations.length).toEqual(1)
        expect(persistOperations[0].state).toEqual('complete')
    })
})
