// @flow

import React from 'react'
import { useSelector } from 'react-redux'

import { productStates } from '$shared/utils/constants'
import useProduct from '$mp/containers/ProductController/useProduct'
import {
    selectSubscriptionIsValid,
    selectStreams,
    selectFetchingStreams,
} from '$mp/modules/product/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import { isPaidProduct } from '$mp/utils/product'

import styles from './streams.pcss'

const Streams = () => {
    const product = useProduct()
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const userData = useSelector(selectUserData)
    const streams = useSelector(selectStreams)
    const fetchingStreams = useSelector(selectFetchingStreams)
    const isLoggedIn = userData !== null
    const isProductFree = !!(product && !isPaidProduct(product))

    return (
        <StreamListing
            product={product}
            streams={streams}
            fetchingStreams={fetchingStreams}
            showStreamActions={product.state === productStates.DEPLOYED}
            isLoggedIn={isLoggedIn}
            isProductSubscriptionValid={isProductSubscriptionValid}
            isProductFree={isProductFree}
            className={styles.section}
        />
    )
}

export default Streams
