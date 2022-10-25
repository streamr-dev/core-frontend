import { $ElementType } from 'utility-types'
import { useMemo, useCallback, useContext } from 'react'
import BN from 'bignumber.js'
import { Context as UndoContext } from '$shared/contexts/Undo'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'
import { timeUnits } from '$shared/utils/constants'
import type { Product, ContactDetails } from '$mp/types/product-types'
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
export function useEditableProductActions() {
    const { updateState: commit } = useEditableState()
    const { undo } = useContext(UndoContext)
    const { setTouched } = useContext(ValidationContext)
    const updateProduct = useCallback(
        (product: Record<string, any>, msg = 'Update product') => {
            commit(msg, (p: Product) => ({ ...p, ...product }))
        },
        [commit],
    )
    const updateName = useCallback(
        (name: $ElementType<Product, 'name'>) => {
            commit('Update name', (p: Product) => ({ ...p, name }))
            setTouched('name')
        },
        [commit, setTouched],
    )
    const updateDescription = useCallback(
        (description: $ElementType<Product, 'description'>) => {
            commit('Update description', (p: Product) => ({ ...p, description }))
            setTouched('description')
        },
        [commit, setTouched],
    )
    const updateChain = useCallback(
        (chain: $ElementType<Product, 'chain'>) => {
            commit('Update chain', (p: Product) => ({ ...p, chain }))
            setTouched('chain')
        },
        [commit, setTouched],
    )
    const updatePricingToken = useCallback(
        (pricingTokenAddress: $ElementType<Product, 'pricingTokenAddress'>, pricingTokenDecimals: BN) => {
            commit('Update payment token', (p: Product) => ({
                ...p,
                pricingTokenAddress,
                pricingTokenDecimals,
            }))
            setTouched('paymentTokenContract')
        },
        [commit, setTouched],
    )
    const updateImageUrl = useCallback(
        (image: $ElementType<Product, 'imageUrl'>) => {
            commit('Update image url', (p: Product) => ({ ...p, imageUrl: image }))
            setTouched('imageUrl')
        },
        [commit, setTouched],
    )
    const updateImageFile = useCallback(
        (image: File) => {
            commit('Update image file', ({ imageUrl, ...p }: Product) => ({
                ...p,
                newImageToUpload: image,
            }))
            setTouched('imageUrl')
        },
        [commit, setTouched],
    )
    const updateStreams = useCallback(
        (streams: StreamIdList) => {
            commit('Update streams', (p: Product) => ({ ...p, streams }))
            setTouched('streams')
        },
        [commit, setTouched],
    )
    const updateCategory = useCallback(
        (category: $ElementType<Product, 'category'>) => {
            commit('Update category', (p: Product) => ({ ...p, category }))
            setTouched('category')
            setTouched('details')
        },
        [commit, setTouched],
    )
    const updateAdminFee = useCallback(
        (adminFee: string) => {
            commit('Update admin fee', (p: Product) => ({ ...p, adminFee }))
            setTouched('adminFee')
            setTouched('details')
        },
        [commit, setTouched],
    )
    const updateRequiresWhitelist = useCallback(
        (requiresWhitelist: boolean, touched = true) => {
            commit('Update whitelist enabled', (p: Product) => ({ ...p, requiresWhitelist }))
            setTouched('requiresWhitelist', touched)
        },
        [commit, setTouched],
    )
    const updateIsFree = useCallback(
        (isFree: $ElementType<Product, 'isFree'>, decimals: BN) => {
            commit('Update is free', (p: Product) => {
                // Switching product from free to paid also changes its price from 0 (only
                // if it's 0) to 1. We're doing it to avoid premature validation errors.
                const price = p.isFree && !isFree && new BN(p.price).isZero() ? new BN(1).toString() : p.price
                return {
                    ...p,
                    isFree,
                    price,
                    pricePerSecond: getPricePerSecond(isFree, price, p.timeUnit, decimals),
                }
            })
            setTouched('pricePerSecond')
        },
        [commit, setTouched],
    )
    const updatePrice = useCallback(
        (
            price: $ElementType<Product, 'price'>,
            priceCurrency: $ElementType<Product, 'priceCurrency'>,
            timeUnit: $ElementType<Product, 'timeUnit'>,
            decimals: BN,
        ) => {
            commit('Update price', (p: Product) => ({
                ...p,
                price,
                priceCurrency,
                pricePerSecond: getPricePerSecond(p.isFree, price, timeUnit, decimals),
                timeUnit,
            }))
            setTouched('pricePerSecond')
        },
        [commit, setTouched],
    )
    const updateBeneficiaryAddress = useCallback(
        (beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>, didTouch = true) => {
            commit('Update beneficiary address', (p: Product) => ({
                ...p,
                beneficiaryAddress,
            }))

            if (didTouch) {
                setTouched('beneficiaryAddress')
            }
        },
        [commit, setTouched],
    )
    const updateType = useCallback(
        (type: $ElementType<Product, 'type'>) => {
            commit('Update type', (p: Product) => ({ ...p, type }))
            setTouched('type')
        },
        [commit, setTouched],
    )
    const updateTermsOfUse = useCallback(
        (termsOfUse: $ElementType<Product, 'termsOfUse'>) => {
            commit('Update terms of use', (p: Product) => ({ ...p, termsOfUse }))
            setTouched('termsOfUse')
        },
        [commit, setTouched],
    )
    const updateContactUrl = useCallback(
        (url: $ElementType<ContactDetails, 'url'>) => {
            commit('Update contact url', (p: Product) => ({
                ...p,
                contact: { ...(p.contact || {}), url },
            }))
            setTouched('url')
        },
        [commit, setTouched],
    )
    const updateContactEmail = useCallback(
        (email: $ElementType<ContactDetails, 'email'>) => {
            commit('Update contact email', (p: Product) => ({
                ...p,
                contact: { ...(p.contact || {}), email },
            }))
            setTouched('email')
        },
        [commit, setTouched],
    )
    const updateSocialLinks = useCallback(
        ({ social1, social2, social3, social4 }: SocialLinks) => {
            commit('Update social links', (p: Product) => ({
                ...p,
                contact: {
                    ...(p.contact || {}),
                    // $FlowFixMe: "Computing object literal may lead to an exponentially large number of cases to reason about because inferred union"
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
            updateType,
            updateTermsOfUse,
            updateContactUrl,
            updateContactEmail,
            updateSocialLinks,
        ],
    )
}
export default useEditableProductActions
