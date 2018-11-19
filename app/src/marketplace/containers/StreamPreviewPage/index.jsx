// @flow

// import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import StreamPreviewPage from '../../components/StreamPreviewPage'
import type { StoreState } from '$shared/flowtype/store-state'
import type { StreamList, StreamId } from '$shared/flowtype/stream-types'
import { selectStreams as selectProductStreams } from '../../modules/product/selectors'
import type { ApiKey, User } from '$shared/flowtype/user-types'
import { selectApiKey, selectUserData } from '$shared/modules/user/selectors'
import { getApiKeys } from '$shared/modules/user/actions'
import { notificationIcons } from '$mp/utils/constants'
import { showNotification } from '$mp/modules/notifications/actions'
import type { ProductId } from '$mp/flowtype/product-types'
import { getStreamsByProductId } from '$mp/modules/product/actions'

type OwnProps = {
    match: {
        params: {
            streamId: StreamId,
            id: ProductId,
        }
    }
}

type StateProps = {
    streams: StreamList,
    streamId: StreamId,
    currentUser: ?User,
    apiKey: ?ApiKey,
}

type DispatchProps = {
    getApiKeys: () => void,
    getStreams: () => void,
    showStreamIdCopiedNotification: () => void,
}

const mapStateToProps = (state: StoreState, { match: { params: { id, streamId } } }: OwnProps): StateProps => ({
    streams: selectProductStreams(state),
    currentUser: selectUserData(state),
    apiKey: selectApiKey(state),
    productId: id,
    streamId,
})

const mapDispatchToProps = (dispatch: Function, { match: { params: { id: productId } } }: OwnProps): DispatchProps => ({
    getApiKeys: () => dispatch(getApiKeys()),
    getStreams: () => dispatch(getStreamsByProductId(productId)),
    showStreamIdCopiedNotification: () => dispatch(showNotification(I18n.t('notifications.streamIdCopied'), notificationIcons.CHECKMARK)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamPreviewPage)
