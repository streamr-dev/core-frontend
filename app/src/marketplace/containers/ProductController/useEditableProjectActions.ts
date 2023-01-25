import { useCallback, useContext, useMemo } from 'react'
import BN from 'bignumber.js'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'
import { timeUnits } from '$shared/utils/constants'
import type { ContactDetails, Project } from '$mp/types/project-types'
import type { StreamIdList } from '$shared/types/stream-types'
import { ValidationContext2 } from '$mp/containers/ProductController/ValidationContextProvider2'
import { NumberString, TimeUnit } from '$shared/types/common-types'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { ProjectTypeEnum } from '$mp/utils/constants'

const getPricePerSecond = (isFree: boolean, price: NumberString, timeUnit: TimeUnit, decimals: BN) =>
    isFree ? new BN(0) : pricePerSecondFromTimeUnit(new BN(price || 0), timeUnit || timeUnits.hour, decimals)

export type EditableProjectActions = {
    updateProject: (project: Partial<Project>) => void,
    updateName: (name: Project['name']) => void,
    updateDescription: (description: Project['description']) => void,
    updateChain: (chain: Project['chain']) => void,
    updatePricingToken: (pricingTokenAddress: Project['pricingTokenAddress'], pricingTokenDecimals: BN) => void,
    updateImageUrl: (image: Project['imageUrl']) => void,
    updateImageFile: (image: File) => void,
    updateStreams: (streams: StreamIdList) => void,
    updateAdminFee: (fee: Project['adminFee']) => void,
    updatePrice: (
        price: Project['price'],
        priceCurrency: Project['priceCurrency'],
        timeUnit: Project['timeUnit'],
        decimals: BN,
    ) => void,
    updateBeneficiaryAddress: (beneficiaryAddress: Project['beneficiaryAddress'], touched?: boolean) => void,
    updateExistingDUAddress: (address: string, touched?: boolean) => void,
    updateType: (type: ProjectTypeEnum) => void,
    updateTermsOfUse: (termsOfUse: Project['termsOfUse']) => void,
    updateContactUrl: (url: ContactDetails['url']) => void,
    updateContactEmail: (email: ContactDetails['email']) => void,
    updateSocialUrl: (platform: 'twitter' | 'telegram' | 'reddit' | 'linkedin', url: string) => void,
}
export const useEditableProjectActions = (): EditableProjectActions => {
    const {state, updateState} = useContext(ProjectStateContext)
    const { setTouched } = useContext(ValidationContext2)
    const updateProject = useCallback<EditableProjectActions['updateProject']>(
        (project: Partial<Project>) => {
            updateState(project)
        },
        [updateState],
    )
    const updateName = useCallback(
        (name: Project['name']) => {
            updateState({ name })
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
    const updateChain = useCallback<EditableProjectActions['updateChain']>(
        (chain: string) => {
            updateState({chain })
            setTouched('chain')
        },
        [updateState, setTouched],
    )
    const updatePricingToken = useCallback<EditableProjectActions['updatePricingToken']>(
        (pricingTokenAddress: string, pricingTokenDecimals: BN) => {
            updateState({
                pricingTokenAddress,
                pricingTokenDecimals: pricingTokenDecimals.toNumber(),
            })
            setTouched('pricingTokenAddress')
        },
        [updateState, setTouched],
    )
    const updateImageUrl = useCallback<EditableProjectActions['updateImageUrl']>(
        (image: string) => {
            updateState({imageUrl: image })
            setTouched('imageUrl')
        },
        [updateState, setTouched],
    )
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
    const updatePrice = useCallback<EditableProjectActions['updatePrice']>(
        (price: Project['price'], priceCurrency: Project['priceCurrency'], timeUnit: Project['timeUnit'], decimals: BN,
        ) => {
            updateState({
                price,
                priceCurrency,
                pricePerSecond: getPricePerSecond(state.type === ProjectTypeEnum.OPEN_DATA, price, timeUnit, decimals).toString(),
                timeUnit,
            })
            setTouched('pricePerSecond')
        },
        [updateState, state, setTouched],
    )
    const updateBeneficiaryAddress = useCallback<EditableProjectActions['updateBeneficiaryAddress']>(
        (beneficiaryAddress: Project['beneficiaryAddress'], didTouch = true) => {
            updateState({
                beneficiaryAddress,
            })

            if (didTouch) {
                setTouched('beneficiaryAddress')
            }
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
        (type: ProjectTypeEnum) => {
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
        let key: 'social1' | 'social2' | 'social3' | 'social4'
        switch (platform) {
            case 'twitter':
                key = 'social1'
                break
            case 'telegram':
                key = 'social2'
                break
            case 'reddit':
                key = 'social3'
                break
            case 'linkedin':
                key = 'social4'
                break
        }
        updateState({
            contact: {
                ...(state.contact || {}),
                [key]: url
            }
        })
        setTouched(`contact.${key}`)
    }, [updateState, state, setTouched])

    return useMemo<EditableProjectActions>(
        () => ({
            updateProject,
            updateName,
            updateDescription,
            updateChain,
            updatePricingToken,
            updateImageUrl,
            updateImageFile,
            updateStreams,
            updateAdminFee,
            updatePrice,
            updateBeneficiaryAddress,
            updateExistingDUAddress,
            updateType,
            updateTermsOfUse,
            updateContactUrl,
            updateContactEmail,
            updateSocialUrl,
        }),
        [
            updateProject,
            updateName,
            updateDescription,
            updateChain,
            updatePricingToken,
            updateImageUrl,
            updateImageFile,
            updateStreams,
            updateAdminFee,
            updatePrice,
            updateBeneficiaryAddress,
            updateExistingDUAddress,
            updateType,
            updateTermsOfUse,
            updateContactUrl,
            updateContactEmail,
            updateSocialUrl,
        ],
    )
}
