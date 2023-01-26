import { $ElementType } from 'utility-types'
import { useMemo, useCallback, useContext } from 'react'
import BN from 'bignumber.js'
import { Context as UndoContext } from '$shared/contexts/Undo'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'
import { timeUnits } from '$shared/utils/constants'
import type { Project, ContactDetails } from '$mp/types/project-types'
import type { StreamIdList } from '$shared/types/stream-types'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { NumberString, TimeUnit } from '$shared/types/common-types'
import { Context as ValidationContext } from './ValidationContextProvider'

const getPricePerSecond = (isFree: boolean, price: NumberString, timeUnit: TimeUnit, decimals: BN) =>
    isFree ? new BN(0) : pricePerSecondFromTimeUnit(new BN(price || 0), timeUnit || timeUnits.hour, decimals)

type SocialLinks = {
    social1?: string
    social2?: string
    social3?: string
    social4?: string
}

/**
 * @deprecated
 * removing the implementations of functions due to model change, the whole hook will be removed later
 */
export function useEditableProductActions() {
    const { updateState: commit } = useEditableState()
    const { undo } = useContext(UndoContext)
    const { setTouched } = useContext(ValidationContext)
    const updateProduct = useCallback(
        (product: Record<string, any>, msg = 'Update product') => {
            commit(msg, (p: Project) => ({ ...p, ...product }))
        },
        [commit],
    )
    const updateName = useCallback(
        (name: $ElementType<Project, 'name'>) => {
            commit('Update name', (p: Project) => ({ ...p, name }))
            setTouched('name')
        },
        [commit, setTouched],
    )
    const updateDescription = useCallback(
        (description: string) => {
            commit('Update description', (p: Project) => ({ ...p, description }))
            setTouched('description')
        },
        [commit, setTouched],
    )
    const updateChain = useCallback(
        (chain: $ElementType<Project, 'chain'>) => {
            commit('Update chain', (p: Project) => ({ ...p, chain }))
            setTouched('chain')
        },
        [commit, setTouched],
    )
    const updatePricingToken = useCallback(
        (pricingTokenAddress: $ElementType<Project, 'pricingTokenAddress'>, pricingTokenDecimals: BN) => {
            commit('Update payment token', (p: Project) => ({
                ...p,
                pricingTokenAddress,
                pricingTokenDecimals,
            }))
            setTouched('paymentTokenContract')
        },
        [commit, setTouched],
    )
    const updateImageUrl = useCallback(
        (image: $ElementType<Project, 'imageUrl'>) => {
            commit('Update image url', (p: Project) => ({ ...p, imageUrl: image }))
            setTouched('imageUrl')
        },
        [commit, setTouched],
    )
    const updateImageFile = useCallback(
        (image: File) => {
            commit('Update image file', ({ imageUrl, ...p }: Project) => ({
                ...p,
                newImageToUpload: image,
            }))
            setTouched('imageUrl')
        },
        [commit, setTouched],
    )
    const updateStreams = useCallback(
        (streams: StreamIdList) => {
            commit('Update streams', (p: Project) => ({ ...p, streams }))
            setTouched('streams')
        },
        [commit, setTouched],
    )
    const updateCategory = useCallback(
        (category) => {
        },
        [commit, setTouched],
    )
    const updateAdminFee = useCallback(
        (adminFee: string) => {
            commit('Update admin fee', (p: Project) => ({ ...p, adminFee }))
            setTouched('adminFee')
            setTouched('details')
        },
        [commit, setTouched],
    )
    const updateRequiresWhitelist = useCallback(
        (requiresWhitelist: boolean, touched = true) => {
            commit('Update whitelist enabled', (p: Project) => ({ ...p, requiresWhitelist }))
            setTouched('requiresWhitelist', touched)
        },
        [commit, setTouched],
    )
    const updateIsFree = useCallback(
        (isFree, decimals: BN) => {
        },
        [commit, setTouched],
    )
    const updatePrice = useCallback(
        (
            price: $ElementType<Project, 'price'>,
            priceCurrency: $ElementType<Project, 'priceCurrency'>,
            timeUnit: $ElementType<Project, 'timeUnit'>,
            decimals: BN,
        ) => {
        },
        [commit, setTouched],
    )
    const updateBeneficiaryAddress = useCallback(
        (beneficiaryAddress: $ElementType<Project, 'beneficiaryAddress'>, didTouch = true) => {
            commit('Update beneficiary address', (p: Project) => ({
                ...p,
                beneficiaryAddress,
            }))

            if (didTouch) {
                setTouched('beneficiaryAddress')
            }
        },
        [commit, setTouched],
    )
    const updateExistingDUAddress = useCallback(
        (address: string, didTouch = true) => {
            commit('Update existing DU address', (p: Project) => ({
                ...p,
                existingDUAddress: address,
            }))

            if (didTouch) {
                setTouched('existingDUAddress')
            }
        },
        [commit, setTouched],
    )
    const updateType = useCallback(
        (type: $ElementType<Project, 'type'>) => {
            commit('Update type', (p: Project) => ({ ...p, type }))
            setTouched('type')
        },
        [commit, setTouched],
    )
    const updateTermsOfUse = useCallback(
        (termsOfUse: $ElementType<Project, 'termsOfUse'>) => {
            commit('Update terms of use', (p: Project) => ({ ...p, termsOfUse }))
            setTouched('termsOfUse')
        },
        [commit, setTouched],
    )
    const updateContactUrl = useCallback(
        (url: $ElementType<ContactDetails, 'url'>) => {
            commit('Update contact url', (p: Project) => ({
                ...p,
                contact: { ...(p.contact || {}), url },
            }))
            setTouched('url')
        },
        [commit, setTouched],
    )
    const updateContactEmail = useCallback(
        (email: $ElementType<ContactDetails, 'email'>) => {
            commit('Update contact email', (p: Project) => ({
                ...p,
                contact: { ...(p.contact || {}), email },
            }))
            setTouched('email')
        },
        [commit, setTouched],
    )
    const updateSocialLinks = useCallback(
        ({ social1, social2, social3, social4 }: SocialLinks) => {
            commit('Update social links', (p: Project) => ({
                ...p,
                contact: {
                    ...(p.contact || {}),
                    ...(social1 != null && {
                        social1,
                    }),
                    ...(social2 != null && {
                        social2,
                    }),
                    ...(social3 != null && {
                        social3,
                    }),
                    ...(social4 != null && {
                        social4,
                    }),
                },
            }))
            setTouched('socialLinks')
        },
        [commit, setTouched],
    )
    return useMemo(
        () => ({
            undo,
            updateProduct,
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
            updateSocialLinks,
        }),
        [
            undo,
            updateProduct,
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
            updateSocialLinks,
        ],
    )
}
export default useEditableProductActions
