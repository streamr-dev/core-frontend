import { useCallback, useContext, useMemo } from 'react'
import BN from 'bignumber.js'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'
import { ContactDetails, Project } from '$mp/types/project-types'
import { StreamIdList } from '$shared/types/stream-types'
import { ValidationContext } from '$mp/containers/ProductController/ValidationContextProvider'
import { NumberString} from '$shared/types/common-types'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { ProjectType } from '$shared/types'
import {TimeUnit, timeUnits} from "$shared/utils/timeUnit"

const getPricePerSecond = (isFree: boolean, price: NumberString, timeUnit: TimeUnit, decimals: BN) =>
    isFree ? new BN(0) : pricePerSecondFromTimeUnit(new BN(price || 0), timeUnit || timeUnits.hour, decimals)

export type EditableProjectActions = {
    updateProject: (project: Partial<Project>) => void,
    updateName: (name: Project['name']) => void,
    updateDescription: (description: Project['description']) => void,
    updateImageFile: (image: File) => void,
    updateStreams: (streams: StreamIdList) => void,
    updateAdminFee: (fee: Project['adminFee']) => void,
    updateDataUnionChainId: (chainId: number) => void,
    updateSalePoints: (salePoints: Project['salePoints']) => void,
    updateExistingDUAddress: (address: string, touched?: boolean) => void,
    updateType: (type: ProjectType) => void,
    updateTermsOfUse: (termsOfUse: Project['termsOfUse']) => void,
    updateContactUrl: (url: ContactDetails['url']) => void,
    updateContactEmail: (email: ContactDetails['email']) => void,
    updateSocialUrl: (platform: 'twitter' | 'telegram' | 'reddit' | 'linkedIn', url: string) => void,
    updateCreator: (creatorName: string) => void,
    updateIsDeployingNewDU: (isDeployingNewDU: boolean) => void
}
export const useEditableProjectActions = (): EditableProjectActions => {
    const {state, updateState} = useContext(ProjectStateContext)
    const { setTouched } = useContext(ValidationContext)

    const updateProject = useCallback<EditableProjectActions['updateProject']>(
        (project: Partial<Project>) => {
            updateState(project)
        },
        [updateState],
    )
    const updateName = useCallback(
        (name: Project['name']) => {
            updateState({name})
            setTouched('name')
        },
        [updateState, setTouched],
    )
    const updateDescription = useCallback<EditableProjectActions['updateDescription']>(
        (description: string) => {
            updateState({description})
            setTouched('description')
        },
        [updateState, setTouched],
    )
    const updateDataUnionChainId = useCallback<EditableProjectActions['updateDataUnionChainId']>(
        (chainId: number) => {
            updateState({dataUnionChainId: chainId})
            setTouched('dataUnionChainId')
        },
        [updateState, setTouched],
    )

    const updateSalePoints = useCallback<EditableProjectActions['updateSalePoints']>((salePoints: Project['salePoints']) => {
        updateState({salePoints})
        setTouched('salePoints')
    }, [updateState, setTouched])

    const updateImageFile = useCallback<EditableProjectActions['updateImageFile']>(
        (image: File) => {
            updateState({newImageToUpload: image})
            setTouched('imageUrl')
        },
        [updateState, setTouched],
    )
    const updateStreams = useCallback<EditableProjectActions['updateStreams']>(
        (streams: StreamIdList) => {
            updateState({streams })
            setTouched('streams')
        },
        [updateState, setTouched],
    )
    const updateAdminFee = useCallback<EditableProjectActions['updateAdminFee']>(
        (adminFee: Project['adminFee']) => {
            updateState({ adminFee })
            setTouched('adminFee')
        },
        [updateState, setTouched],
    )
    const updateExistingDUAddress = useCallback<EditableProjectActions['updateExistingDUAddress']>(
        (address: string, didTouch = true) => {
            updateState({
                existingDUAddress: address,
            })

            if (didTouch) {
                setTouched('existingDUAddress')
            }
        },
        [updateState, setTouched],
    )
    const updateType = useCallback<EditableProjectActions['updateType']>(
        (type: ProjectType) => {
            updateState({type })
            setTouched('type')
        },
        [updateState, setTouched],
    )
    const updateTermsOfUse = useCallback<EditableProjectActions['updateTermsOfUse']>(
        (termsOfUse: Project['termsOfUse']) => {
            updateState({termsOfUse })
            setTouched('termsOfUse')
        },
        [updateState, setTouched],
    )
    const updateContactUrl = useCallback<EditableProjectActions['updateContactUrl']>(
        (url: ContactDetails['url']) => {
            updateState({
                contact: { ...(state.contact || {}), url },
            })
            setTouched('contact.url')
        },
        [updateState, state, setTouched],
    )
    const updateContactEmail = useCallback<EditableProjectActions['updateContactEmail']>(
        (email: ContactDetails['email']) => {
            updateState({
                contact: { ...(state.contact || {}), email },
            })
            setTouched('contact.email')
        },
        [updateState, state, setTouched],
    )
    const updateSocialUrl = useCallback<EditableProjectActions['updateSocialUrl']>((platform, url) => {
        updateState({
            contact: {
                ...(state.contact || {}),
                [platform]: url
            }
        })
        setTouched(`contact.${platform}`)
    }, [updateState, state, setTouched])

    const updateCreator = useCallback<EditableProjectActions['updateCreator']>((creatorName) => {
        updateState({creator: creatorName})
        setTouched('creator')
    }, [updateState, setTouched])

    const updateIsDeployingNewDU = useCallback<EditableProjectActions['updateIsDeployingNewDU']>(((isDeployingNewDU) => {
        updateState({isDeployingNewDU})
        setTouched('isDeployingNewDU')
    }), [updateState, setTouched])

    return useMemo<EditableProjectActions>(
        () => ({
            updateProject,
            updateName,
            updateDescription,
            updateDataUnionChainId,
            updateSalePoints,
            updateImageFile,
            updateStreams,
            updateAdminFee,
            updateExistingDUAddress,
            updateType,
            updateTermsOfUse,
            updateContactUrl,
            updateContactEmail,
            updateSocialUrl,
            updateCreator,
            updateIsDeployingNewDU
        }),
        [
            updateProject,
            updateName,
            updateDescription,
            updateDataUnionChainId,
            updateSalePoints,
            updateImageFile,
            updateStreams,
            updateAdminFee,
            updateExistingDUAddress,
            updateType,
            updateTermsOfUse,
            updateContactUrl,
            updateContactEmail,
            updateSocialUrl,
            updateCreator,
            updateIsDeployingNewDU
        ],
    )
}
