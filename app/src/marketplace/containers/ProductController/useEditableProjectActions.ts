import { useMemo, useCallback, useContext } from 'react'
import BN from 'bignumber.js'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'
import { timeUnits } from '$shared/utils/constants'
import type { Project, ContactDetails } from '$mp/types/project-types'
import type { StreamIdList } from '$shared/types/stream-types'
import { NumberString, TimeUnit } from '$shared/types/common-types'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { Context as ValidationContext } from './ValidationContextProvider'

const getPricePerSecond = (isFree: boolean, price: NumberString, timeUnit: TimeUnit, decimals: BN) =>
    isFree ? new BN(0) : pricePerSecondFromTimeUnit(new BN(price || 0), timeUnit || timeUnits.hour, decimals)

type SocialLinks = {
    social1?: string
    social2?: string
    social3?: string
    social4?: string
}
export type EditableProjectActions = {
    updateProject: (project: Partial<Project>) => void,
    updateName: (name: Project['name']) => void,
    updateDescription: (description: Project['description']) => void,
    updateChain: (chain: Project['chain']) => void,
    updatePricingToken: (pricingTokenAddress: Project['pricingTokenAddress'], pricingTokenDecimals: BN) => void,
    updateImageUrl: (image: Project['imageUrl']) => void,
    updateImageFile: (image: File) => void,
    updateStreams: (streams: StreamIdList) => void,
    updateCategory: (category: Project['category']) => void,
    updateAdminFee: (fee: Project['adminFee']) => void,
    updateRequiresWhitelist: (requiresWhitelist: boolean, touched?: boolean) => void,
    updateIsFree: (isFree: Project['isFree'], decimals: BN) => void,
    updatePrice: (
        price: Project['price'],
        priceCurrency: Project['priceCurrency'],
        timeUnit: Project['timeUnit'],
        decimals: BN,
    ) => void,
    updateBeneficiaryAddress: (beneficiaryAddress: Project['beneficiaryAddress'], touched?: boolean) => void,
    updateExistingDUAddress: (address: string, touched?: boolean) => void,
    updateType: (type: Project['type']) => void,
    updateTermsOfUse: (termsOfUse: Project['termsOfUse']) => void,
    updateContactUrl: (url: ContactDetails['url']) => void,
    updateContactEmail: (email: ContactDetails['email']) => void,
    updateSocialUrl: (platform: 'twitter' | 'telegram' | 'reddit' | 'linkedin', url: string) => void,
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
            setTouched('paymentTokenContract')
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
    const updateCategory = useCallback<EditableProjectActions['updateCategory']>(
        (category: Project['category']) => {
            updateState({ category })
            setTouched('category')
            setTouched('details')
        },
        [updateState, setTouched],
    )
    const updateAdminFee = useCallback<EditableProjectActions['updateAdminFee']>(
        (adminFee: Project['adminFee']) => {
            updateState({ adminFee })
            setTouched('adminFee')
            setTouched('details')
        },
        [updateState, setTouched],
    )
    const updateRequiresWhitelist = useCallback<EditableProjectActions['updateRequiresWhitelist']>(
        (requiresWhitelist: boolean, touched = true) => {
            updateState({ requiresWhitelist })
            setTouched('requiresWhitelist', touched)
        },
        [updateState, setTouched],
    )
    const updateIsFree = useCallback<EditableProjectActions['updateIsFree']>(
        (isFree: Project['isFree'], decimals: BN) => {
            // Switching product from free to paid also changes its price from 0 (only
            // if it's 0) to 1. We're doing it to avoid premature validation errors.
            const price = state.isFree && !isFree && new BN(state.price).isZero()
                ? new BN(1).toString() : new BN(state.price).toString()
            updateState({
                isFree,
                price,
                pricePerSecond: getPricePerSecond(isFree, price, state.timeUnit, decimals).toString()
            })
            setTouched('pricePerSecond')
        },
        [updateState, state, setTouched],
    )
    const updatePrice = useCallback<EditableProjectActions['updatePrice']>(
        (price: Project['price'], priceCurrency: Project['priceCurrency'], timeUnit: Project['timeUnit'], decimals: BN,
        ) => {
            updateState({
                price,
                priceCurrency,
                pricePerSecond: getPricePerSecond(state.isFree, price, timeUnit, decimals).toString(),
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
        (type: Project['type']) => {
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
            setTouched('url')
        },
        [updateState, state, setTouched],
    )
    const updateContactEmail = useCallback<EditableProjectActions['updateContactEmail']>(
        (email: ContactDetails['email']) => {
            updateState({
                contact: { ...(state.contact || {}), email },
            })
            setTouched('email')
        },
        [updateState, state, setTouched],
    )
    const updateSocialUrl = useCallback<EditableProjectActions['updateSocialUrl']>((platform, url) => {
        let key: string
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
        setTouched('socialLinks')
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
            updateCategory,
            updateAdminFee,
            updateRequiresWhitelist,
            updateIsFree,
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
            updateCategory,
            updateAdminFee,
            updateRequiresWhitelist,
            updateIsFree,
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
