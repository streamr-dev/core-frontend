// @flow

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import moment from 'moment'
import { I18n } from 'react-redux-i18n'

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
import routes from '$routes'

import styles from './hero.pcss'

const Hero = () => {
    const dispatch = useDispatch()
    const product = useProduct()
    const { api: purchaseDialog } = useModal('purchase')
    const { isPending, wrap } = usePending('product.PURCHASE_DIALOG')
    const isMounted = useIsMounted()

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const subscription = useSelector(selectContractSubscription)

    const productId = product.id
    const isPaid = isPaidProduct(product)

    const onPurchase = useCallback(async () => (
        wrap(async () => {
            if (isLoggedIn) {
                if (isPaid) {
                    // Paid product has to be bought with Metamask
                    const { started, succeeded, viewInCore } = await purchaseDialog.open({
                        productId,
                    })

                    if (isMounted() && !!started && !!succeeded) {
                        if (viewInCore) {
                            dispatch(replace(routes.purchases()))
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
                        title: I18n.t('notifications.productSaved'),
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
    ), [productId, dispatch, isLoggedIn, purchaseDialog, isPaid, wrap, isMounted])

    return (
        <HeroComponent
            className={styles.hero}
            product={product}
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
                />
            }
        />
    )
}

export default Hero
