// @flow

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'

import useProduct from '$mp/containers/ProductController/useProduct'
import useModal from '$shared/hooks/useModal'
import { selectUserData } from '$shared/modules/user/selectors'
import { addFreeProduct } from '$mp/modules/purchase/actions'

import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import HeroComponent from '$mp/components/Hero'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import {
    selectSubscriptionIsValid,
    selectContractSubscription,
} from '$mp/modules/product/selectors'
import { ImageTile } from '$shared/components/Tile'

import routes from '$routes'

import styles from './hero.pcss'

const Hero = () => {
    const dispatch = useDispatch()
    const product = useProduct()
    const { api: purchaseDialog } = useModal('purchase')

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const subscription = useSelector(selectContractSubscription)

    const productId = product.id
    const isPaid = isPaidProduct(product)
    const onPurchase = useCallback(async () => {
        if (isLoggedIn) {
            if (isPaid) {
                // Paid product has to be bought with Metamask
                await purchaseDialog.open({
                    productId,
                })
            } else {
                // Free product can be bought directly
                dispatch(addFreeProduct(productId || ''))
            }
        } else {
            dispatch(replace(routes.auth.login({
                redirect: routes.marketplace.product({
                    id: productId,
                }),
            })))
        }
    }, [productId, dispatch, isLoggedIn, purchaseDialog, isPaid])

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
                />
            }
        />
    )
}

export default Hero
