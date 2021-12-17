// @flow

import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Segment from '$shared/components/Segment'
import { useController } from '$mp/containers/ProductController'
import useProductSubscription from '$mp/containers/ProductController/useProductSubscription'
import { selectUserData } from '$shared/modules/user/selectors'
import { usePending } from '$shared/hooks/usePending'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import { isPaidProduct } from '$mp/utils/product'
import routes from '$routes'

const Streams = () => {
    const { product, productStreams: streams } = useController()
    const history = useHistory()
    const productId = product.id
    const { isSubscriptionValid } = useProductSubscription()
    const userData = useSelector(selectUserData)
    const { isPending: fetchingStreams } = usePending('product.LOAD_PRODUCT_STREAMS')
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
}

export default Streams
