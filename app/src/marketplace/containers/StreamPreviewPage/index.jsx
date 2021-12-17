// @flow

import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useClient, useSubscription } from 'streamr-client-react'
import usePending from '$shared/hooks/usePending'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$shared/components/StreamPreview'
import { useThrottled } from '$shared/hooks/wrapCallback'
import useIsMounted from '$shared/hooks/useIsMounted'
import { Message } from '$shared/utils/SubscriptionEvents'
import { selectUserData } from '$shared/modules/user/selectors'
import { getProductSubscription } from '$mp/modules/product/actions'
import useIsSessionTokenReady from '$shared/hooks/useIsSessionTokenReady'
import routes from '$routes'
import ProductController, { useController } from '../ProductController'
import useProductSubscription from '../ProductController/useProductSubscription'

const PreviewModal = ({ onClose, ...previewProps }) => (
    <ModalPortal>
        <ModalDialog onClose={onClose} fullpage noScroll>
            <StreamPreview {...previewProps} onClose={onClose} />
        </ModalDialog>
    </ModalPortal>
)

const LOCAL_DATA_LIST_LENGTH = 20

const PreviewModalWithSubscription = ({ streamId, stream, ...previewProps }) => {
    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState([])
    const [dataError, setDataError] = useState(false)
    const hasLoaded = useIsSessionTokenReady()
    const client = useClient()
    const isMounted = useIsMounted()
    const [activePartition, setActivePartition] = useState(0)
    const [subscribed, setSubscribed] = useState(false)

    const updateDataToState = useThrottled(useCallback((data) => {
        setVisibleData([...data])
    }, []), 100)

    const onError = useCallback(() => {
        if (isMounted()) {
            setDataError(true)
        }
    }, [isMounted])

    const onData = useCallback((data, metadata) => {
        if (!isMounted()) { return }
        switch (data.type) {
            case Message.Done:
            case Message.Notification:
            case Message.Warning: {
                // ignore
                return
            }
            case Message.Error: {
                onError()
                return
            }
            default: // continue
        }

        const dataPoint = {
            data,
            metadata,
        }

        dataRef.current.unshift(dataPoint)
        dataRef.current.length = Math.min(dataRef.current.length, LOCAL_DATA_LIST_LENGTH)
        updateDataToState(dataRef.current)
    }, [dataRef, updateDataToState, isMounted, onError])

    const onSub = useCallback(() => {
        if (isMounted()) {
            // Clear data when subscribed to make sure
            // we don't get duplicate messages with resend
            setVisibleData([])
            dataRef.current = []
            setSubscribed(true)
        }
    }, [isMounted])

    useEffect(() => {
        setActivePartition(0)
        setSubscribed(false)
    }, [streamId])

    useEffect(() => {
        setVisibleData([])
    }, [activePartition])

    useSubscription({
        stream: streamId,
        partition: activePartition,
        resend: {
            last: LOCAL_DATA_LIST_LENGTH,
        },
    }, {
        onMessage: onData,
        onSubscribed: onSub,
    })

    return (
        <PreviewModal
            {...previewProps}
            streamId={streamId}
            stream={stream}
            streamData={visibleData}
            activePartition={activePartition}
            onPartitionChange={setActivePartition}
            loading={!hasLoaded || !subscribed}
            subscriptionError={hasLoaded && !client && ('Error: Unable to process the stream data.')}
            dataError={!!dataError && 'Data'}
        />
    )
}

const PreviewWrap = ({ productId, streamId }) => {
    const history = useHistory()
    const { product, productStreams: streams } = useController()
    const dispatch = useDispatch()
    const { isPending: fetchingStreams } = usePending('product.LOAD_PRODUCT_STREAMS')
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')
    const { loadProductStreams } = useController()
    const isMounted = useIsMounted()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const { isSubscriptionValid } = useProductSubscription()

    const targetStream = useMemo(() => (
        streams && streams.find(({ id }) => id === streamId)
    ), [streamId, streams])
    const streamLoaded = !!targetStream

    useEffect(() => {
        if (!streamLoaded) {
            loadProductStreams(productId, false)
        }
    }, [streamLoaded, loadProductStreams, productId])

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getProductSubscription(productId))
        }
    }, [dispatch, isLoggedIn, productId])

    const redirectToProduct = useCallback(() => {
        if (!isMounted()) { return }
        history.replace(routes.marketplace.product({
            id: productId,
        }))
    }, [
        productId,
        isMounted,
        history,
    ])

    const redirectToPreview = useCallback((targetStreamId) => {
        if (!isMounted()) { return }
        history.replace(routes.marketplace.streamPreview({
            id: productId,
            streamId: targetStreamId,
        }))
    }, [
        productId,
        isMounted,
        history,
    ])

    const redirectToSettings = useCallback((id) => {
        if (!isMounted()) { return }
        history.push(routes.streams.show({
            id,
        }))
    }, [history, isMounted])

    if (!product || loadPending || permissionsPending || fetchingStreams) {
        return (
            <PreviewModal
                streamId={streamId}
                stream={undefined}
                onClose={redirectToProduct}
            />
        )
    }

    const key = (!!product && product.id) || ''

    return (
        <PreviewModalWithSubscription
            key={key}
            streamId={streamId}
            stream={targetStream}
            navigableStreamIds={product.streams}
            titlePrefix={product.name}
            onClose={redirectToProduct}
            onChange={redirectToPreview}
            onStreamSettings={!!isLoggedIn && isSubscriptionValid && redirectToSettings}
        />
    )
}

const ProductContainer = () => {
    const { id: productId, streamId: idProp } = useParams()
    const streamId = useMemo(() => decodeURIComponent(idProp), [idProp])

    return (
        <ProductController
            key={streamId}
            ignoreUnauthorized
            useAuthorization={false}
        >
            <PreviewWrap
                productId={productId}
                streamId={streamId}
            />
        </ProductController>
    )
}

export default ProductContainer
