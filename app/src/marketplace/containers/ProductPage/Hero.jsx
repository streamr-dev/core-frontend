// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import moment from 'moment'

import useProduct from '$mp/containers/ProductController/useProduct'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import { selectUserData } from '$shared/modules/user/selectors'
import { addFreeProduct } from '$mp/modules/product/services'
import { getMyPurchases } from '$mp/modules/myPurchaseList/actions'
import { getProductSubscription } from '$mp/modules/product/actions'
import useIsMounted from '$shared/hooks/useIsMounted'

import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import HeroComponent from '$mp/components/Hero'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import {
    selectSubscriptionIsValid,
    selectContractSubscription,
} from '$mp/modules/product/selectors'
import { ImageTile } from '$shared/components/Tile'
import { NotificationIcon } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import { isAddressWhitelisted } from '$mp/modules/contractProduct/services'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import type { ProductId } from '$mp/flowtype/product-types'
import { getWeb3, validateWeb3 } from '$shared/web3/web3Provider'

import routes from '$routes'

type WhitelistStatus = {
    productId: ProductId,
    validate?: boolean,
}

const getWhitelistStatus = async ({ productId, validate = false }: WhitelistStatus) => {
    const web3 = getWeb3()

    try {
        if (validate) {
            await validateWeb3({
                web3,
                checkNetwork: false, // network check is done later if purchase is possible
            })
        }
        const account = await web3.getDefaultAccount()

        return !!account && isAddressWhitelisted(productId, account)
    } catch (e) {
        // log error but ignore otherwise
        console.warn(e)
    }

    return false
}

const Hero = () => {
    const dispatch = useDispatch()
    const product = useProduct()
    const { api: purchaseDialog } = useModal('purchase')
    const { isPending, wrap } = usePending('product.PURCHASE_DIALOG')
    const isMounted = useIsMounted()
    const { api: requestAccessDialog } = useModal('requestWhitelistAccess')

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const subscription = useSelector(selectContractSubscription)
    const account = useAccountAddress()

    const productId = product.id
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
                            dispatch(replace(routes.subscriptions()))
                        } else {
                            dispatch(getProductSubscription(productId))
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
                dispatch(replace(routes.auth.login({
                    redirect: routes.marketplace.product({
                        id: productId,
                    }),
                })))
            }
        })
    ), [productId,
        dispatch,
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
    ])

    useEffect(() => {
        const loadWhitelistStatus = async () => {
            // set product as whitelisted if that feature is enabled, and if
            // 1) metamask is locked -> clicking request access will prompt Metamask
            // 2) metamask is unlocked and user has access
            const whitelisted = !isWhitelistEnabled || await getWhitelistStatus({
                productId,
            })

            if (isMounted()) {
                setIsWhitelisted(whitelisted)
            }
        }

        if (productId && !isPending) {
            loadWhitelistStatus()
        }
    }, [productId, account, isWhitelistEnabled, isPending, isMounted])

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
                    isValidSubscription={!!isProductSubscriptionValid}
                    productSubscription={subscription}
                    onPurchase={onPurchase}
                    isPurchasing={isPending}
                    isWhitelisted={isWhitelisted}
                />
            }
        />
    )
}

export default Hero
