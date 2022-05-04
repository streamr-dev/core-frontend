// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import { useController } from '$mp/containers/ProductController'
import useProductSubscription from '$mp/containers/ProductController/useProductSubscription'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import { selectUserData } from '$shared/modules/user/selectors'
import { addFreeProduct } from '$mp/modules/product/services'
import { getMyPurchases } from '$mp/modules/myPurchaseList/actions'
import { getProductSubscription } from '$mp/modules/product/actions'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getChainIdFromApiString } from '$shared/utils/chains'

import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import HeroComponent from '$mp/components/Hero'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import { ImageTile } from '$shared/components/Tile'
import { NotificationIcon } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import { isAddressWhitelisted } from '$mp/modules/contractProduct/services'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import type { ProductId } from '$mp/flowtype/product-types'
import validateWeb3 from '$utils/web3/validateWeb3'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import routes from '$routes'

type WhitelistStatus = {
    productId: ProductId,
    validate?: boolean,
    chainId: number,
}

const getWhitelistStatus = async ({ productId, validate = false, chainId }: WhitelistStatus) => {
    try {
        if (validate) {
            await validateWeb3({
                requireNetwork: false, // network check is done later if purchase is possible
                unlockTimeout: true,
            })
        }

        const account = await getDefaultWeb3Account()

        return !!account && isAddressWhitelisted(productId, account, true, chainId)
    } catch (e) {
        // log error but ignore otherwise
        console.warn(e)
    }

    return false
}

const Hero = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { product } = useController()
    const { api: purchaseDialog } = useModal('purchase')
    const { isPending, wrap } = usePending('product.PURCHASE_DIALOG')
    const isMounted = useIsMounted()
    const { api: requestAccessDialog } = useModal('requestWhitelistAccess')

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const { contractSubscription, isSubscriptionValid } = useProductSubscription()
    const account = useAccountAddress()

    const productId = product.id
    const chainId = product && getChainIdFromApiString(product.chain)
    const contactEmail = product && product.contact && product.contact.email
    const productName = product && product.name
    const isPaid = isPaidProduct(product)
    const isWhitelistEnabled = !!(isPaid && product.requiresWhitelist)
    const [isWhitelisted, setIsWhitelisted] = useState(isWhitelistEnabled ? null : false)

    const onPurchase = useCallback(async () => (
        wrap(async () => {
            if (isLoggedIn) {
                if (isPaid) {
                    if (isWhitelistEnabled && !isWhitelisted) {
                        // at this point we know either that user has access or Metamask was locked
                        // do a another check but this time validate web3 which will prompt Metamask
                        const canPurchase = await getWhitelistStatus({
                            productId,
                            validate: true, // prompts metamask if locked
                            chainId,
                        })

                        if (!isMounted()) { return }

                        if (!canPurchase) {
                            await requestAccessDialog.open({
                                contactEmail,
                                productName,
                            })
                            return
                        }
                    }

                    // Paid product has to be bought with Metamask
                    const { started, succeeded, viewInCore } = await purchaseDialog.open({
                        productId,
                    })

                    if (isMounted() && !!started && !!succeeded) {
                        if (viewInCore) {
                            history.replace(routes.subscriptions())
                        } else {
                            dispatch(getProductSubscription(productId, chainId))
                        }
                    }
                } else {
                    // Free product can be bought directly

                    // subscribe for one year (TODO: move to constant)
                    const endsAt = moment().add(1, 'year').unix() // Unix timestamp (seconds)

                    await addFreeProduct(productId || '', endsAt)

                    if (!isMounted()) { return }

                    Notification.push({
                        title: 'Saved to your subscriptions',
                        icon: NotificationIcon.CHECKMARK,
                    })

                    dispatch(getMyPurchases())
                }
            } else {
                history.replace(routes.auth.login({
                    redirect: routes.marketplace.product({
                        id: productId,
                    }),
                }))
            }
        })
    ), [productId,
        dispatch,
        history,
        isLoggedIn,
        purchaseDialog,
        isPaid,
        wrap,
        isMounted,
        isWhitelistEnabled,
        isWhitelisted,
        requestAccessDialog,
        contactEmail,
        productName,
        chainId,
    ])

    useEffect(() => {
        const loadWhitelistStatus = async () => {
            // set product as whitelisted if that feature is enabled, and if
            // 1) metamask is locked -> clicking request access will prompt Metamask
            // 2) metamask is unlocked and user has access
            const whitelisted = !isWhitelistEnabled || await getWhitelistStatus({
                productId,
                chainId,
            })

            if (isMounted()) {
                setIsWhitelisted(whitelisted)
            }
        }

        if (productId && !isPending) {
            loadWhitelistStatus()
        }
    }, [productId, chainId, account, isWhitelistEnabled, isPending, isMounted])

    return (
        <HeroComponent
            leftContent={
                <ImageTile
                    alt={product.name}
                    src={product.imageUrl}
                    showDataUnionBadge={isDataUnion}
                />
            }
            rightContent={
                <ProductDetails
                    product={product}
                    isValidSubscription={!!isSubscriptionValid}
                    productSubscription={contractSubscription}
                    onPurchase={onPurchase}
                    isPurchasing={isPending}
                    isWhitelisted={isWhitelisted}
                />
            }
        />
    )
}

export default Hero
