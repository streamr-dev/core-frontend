// @flow

import React, { useEffect, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'
import { useClient } from 'streamr-client-react'
import { Context as RouterContext } from '$shared/contexts/Router'
import ClientProvider from '$shared/components/StreamrClientProvider'
import Subscription from '$shared/components/Subscription'
import { Provider as SubscriptionStatusProvider } from '$shared/contexts/SubscriptionStatus'
import usePending from '$shared/hooks/usePending'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$shared/components/StreamPreview'
import useProduct from '$mp/containers/ProductController/useProduct'
import {
    selectStreams as selectProductStreams,
    selectFetchingStreams as selectFetchingProductStreams,
    selectProductIsPurchased,
} from '$mp/modules/product/selectors'
import { useThrottled } from '$shared/hooks/wrapCallback'
import useIsMounted from '$shared/hooks/useIsMounted'
import { selectUserData } from '$shared/modules/user/selectors'
import { getProductSubscription } from '$mp/modules/product/actions'
import useIsSessionTokenReady from '$shared/hooks/useIsSessionTokenReady'
import routes from '$routes'
import ProductController, { useController } from '../ProductController'

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

    const onData = useCallback((data, metadata) => {
        if (!isMounted()) { return }

        const dataPoint = {
            data,
            metadata,
        }

        dataRef.current.unshift(dataPoint)
        dataRef.current.length = Math.min(dataRef.current.length, LOCAL_DATA_LIST_LENGTH)
        updateDataToState(dataRef.current)
    }, [dataRef, updateDataToState, isMounted])

    const onSub = useCallback(() => {
        if (isMounted()) {
            // Clear data when subscribed to make sure
            // we don't get duplicate messages with resend
            setVisibleData([])
            dataRef.current = []
            setSubscribed(true)
        }
    }, [isMounted])

    const onError = useCallback(() => {
        if (isMounted()) {
            setDataError(true)
        }
    }, [isMounted])

    useEffect(() => {
        setActivePartition(0)
        setSubscribed(false)
    }, [streamId])

    useEffect(() => {
        setVisibleData([])
    }, [activePartition])

    return (
        <SubscriptionStatusProvider>
            <Subscription
                uiChannel={{
                    id: streamId,
                    partition: activePartition,
                }}
                resendLast={LOCAL_DATA_LIST_LENGTH}
                onSubscribed={onSub}
                isActive
                onMessage={onData}
                onErrorMessage={onError}
            />
            <PreviewModal
                {...previewProps}
                streamId={streamId}
                stream={stream}
                streamData={visibleData}
                activePartition={activePartition}
                onPartitionChange={setActivePartition}
                loading={!hasLoaded || !subscribed}
                subscriptionError={hasLoaded && !client && (I18n.t('streamLivePreview.subscriptionErrorNotice'))}
                dataError={!!dataError && (I18n.t('streamLivePreview.dataErrorNotice'))}
            />
        </SubscriptionStatusProvider>
    )
}

const PreviewWrap = ({ productId, streamId }) => {
    const { history } = useContext(RouterContext)
    const product = useProduct()
    const dispatch = useDispatch()
    const streams = useSelector(selectProductStreams)
    const fetchingStreams = useSelector(selectFetchingProductStreams)
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')
    const { loadProductStreams } = useController()
    const isMounted = useIsMounted()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isProductSubscriptionValid = useSelector(selectProductIsPurchased)

    const targetStream = useMemo(() => (
        streams && streams.find(({ id }) => id === streamId)
    ), [streamId, streams])
    const streamLoaded = !!targetStream

    useEffect(() => {
        if (!streamLoaded) {
            loadProductStreams(productId)
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
            onStreamSettings={!!isLoggedIn && isProductSubscriptionValid && redirectToSettings}
        />
    )
}

const ProductContainer = withRouter((props) => {
    const idProp = props.match.params.streamId
    const streamId = useMemo(() => decodeURIComponent(idProp), [idProp])

    return (
        <ProductController key={streamId} ignoreUnauthorized>
            <ClientProvider>
                <PreviewWrap
                    productId={props.match.params.id}
                    streamId={streamId}
                />
            </ClientProvider>
        </ProductController>
    )
})

export default () => (
    <ProductContainer />
)

