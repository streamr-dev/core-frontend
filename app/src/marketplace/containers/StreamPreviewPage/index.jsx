// @flow

import React, { useEffect, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'

import { Context as RouterContext } from '$shared/contexts/Router'
import ProductController, { useController } from '../ProductController'
import { Provider as ClientProvider, Context as ClientContext } from '$shared/contexts/StreamrClient'
import Subscription from '$shared/components/Subscription'
import { Provider as SubscriptionStatusProvider } from '$shared/contexts/SubscriptionStatus'
import usePending from '$shared/hooks/usePending'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$mp/components/StreamPreview'
import routes from '$routes'
import useProduct from '$mp/containers/ProductController/useProduct'
import {
    selectStreams as selectProductStreams,
    selectFetchingStreams as selectFetchingProductStreams,
} from '$mp/modules/product/selectors'
import { useThrottled } from '$shared/hooks/wrapCallback'
import useIsMounted from '$shared/hooks/useIsMounted'

const FullPage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 239, 239, 0.98);
    z-index: 1;
    overflow-y: scroll;
`

const PreviewModal = ({ onClose, ...previewProps }) => (
    <ModalPortal>
        <ModalDialog onClose={onClose}>
            <FullPage>
                <StreamPreview {...previewProps} onClose={onClose} />
            </FullPage>
        </ModalDialog>
    </ModalPortal>
)

const LOCAL_DATA_LIST_LENGTH = 20

const PreviewModalWithSubscription = ({ streamId, stream, ...previewProps }) => {
    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState([])
    const [dataError, setDataError] = useState(false)
    const { hasLoaded, client } = useContext(ClientContext)
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
    const streams = useSelector(selectProductStreams)
    const fetchingStreams = useSelector(selectFetchingProductStreams)
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')
    const { loadProductStreams } = useController()
    const isMounted = useIsMounted()

    const targetStream = useMemo(() => (
        streams && streams.find(({ id }) => id === streamId)
    ), [streamId, streams])
    const streamLoaded = !!targetStream

    useEffect(() => {
        if (!streamLoaded) {
            loadProductStreams(productId)
        }
    }, [streamLoaded, loadProductStreams, productId])

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
        />
    )
}

const ProductContainer = withRouter((props) => (
    <ProductController key={props.match.params.id} ignoreUnauthorized>
        <ClientProvider>
            <PreviewWrap
                productId={props.match.params.id}
                streamId={props.match.params.streamId}
            />
        </ClientProvider>
    </ProductController>
))

export default () => (
    <ProductContainer />
)

