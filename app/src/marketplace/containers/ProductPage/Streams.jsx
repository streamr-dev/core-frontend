// @flow

import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Segment from '$shared/components/Segment'
import { useController } from '$mp/containers/ProductController'
import useProductSubscription from '$mp/containers/ProductController/useProductSubscription'
import {
    selectStreams,
    selectFetchingStreams,
} from '$mp/modules/product/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import { isPaidProduct } from '$mp/utils/product'
import routes from '$routes'

const Streams = withRouter(({ history }) => {
    const { product } = useController()
    const productId = product.id
    const { isSubscriptionValid } = useProductSubscription()
    const userData = useSelector(selectUserData)
    const streams = useSelector(selectStreams)
    const fetchingStreams = useSelector(selectFetchingStreams)
    const isLoggedIn = userData !== null
    const isProductFree = !!(product && !isPaidProduct(product))

    const onStreamPreview = useCallback((streamId) => {
        history.replace(routes.marketplace.streamPreview({
            id: productId,
            streamId,
        }))
    }, [history, productId])

    const onStreamSettings = useCallback((id) => {
        history.push(routes.streams.show({
            id,
        }))
    }, [history])

    const locked = useMemo(() => !(
        isProductFree || (isLoggedIn && isSubscriptionValid)
    ), [isProductFree, isLoggedIn, isSubscriptionValid])

    return (
        <Segment>
            <Segment.Body>
                <StreamListing
                    streams={streams}
                    fetchingStreams={fetchingStreams}
                    locked={locked}
                    onStreamPreview={onStreamPreview}
                    onStreamSettings={!!isLoggedIn && isSubscriptionValid && onStreamSettings}
                />
            </Segment.Body>
        </Segment>
    )
})

export default Streams
