// @flow

import React, { useCallback, useMemo, useEffect, useState } from 'react'
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

const PAGE_SIZE = 5
const INITIAL_OFFSET = 2 * PAGE_SIZE

const Streams = () => {
    const { product, productStreams: streams, loadProductStreams } = useController()
    const history = useHistory()
    const productId = product.id
    const { isSubscriptionValid } = useProductSubscription()
    const userData = useSelector(selectUserData)
    const { isPending: fetchingStreams } = usePending('product.LOAD_PRODUCT_STREAMS')
    const isLoggedIn = userData !== null
    const isProductFree = !!(product && !isPaidProduct(product))
    const [offset, setOffset] = useState(INITIAL_OFFSET)

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

    useEffect(() => {
        loadProductStreams(product.streams.slice(0, INITIAL_OFFSET))
    }, [product.streams, loadProductStreams])

    const hasMoreResults = useMemo(() => offset < product.streams.length, [offset, product.streams])

    const onLoadMore = useCallback(() => {
        loadProductStreams(product.streams.slice(offset, offset + PAGE_SIZE))

        setOffset(offset + PAGE_SIZE)
    }, [offset, setOffset, loadProductStreams, product.streams])

    return (
        <Segment>
            <Segment.Body>
                <StreamListing
                    streams={streams}
                    totalStreams={product.streams.length}
                    fetchingStreams={fetchingStreams}
                    hasMoreResults={hasMoreResults}
                    onLoadMore={onLoadMore}
                    locked={locked}
                    onStreamPreview={onStreamPreview}
                    onStreamSettings={!!isLoggedIn && isSubscriptionValid && onStreamSettings}
                />
            </Segment.Body>
        </Segment>
    )
}

export default Streams
