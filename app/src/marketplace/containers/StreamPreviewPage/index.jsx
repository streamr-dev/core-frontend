// @flow

// import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import StreamPreviewPage from '$mp/components/StreamPreviewPage'
import type { StoreState } from '$shared/flowtype/store-state'
import type { StreamList, StreamId } from '$shared/flowtype/stream-types'
import { selectStreams as selectProductStreams } from '../../modules/product/selectors'
import type { User } from '$shared/flowtype/user-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import type { ProductId } from '$mp/flowtype/product-types'
import { getStreamsByProductId } from '$mp/modules/product/actions'
import routes from '$routes'

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
    authApiKeyId: ?ResourceKeyId,
}

type DispatchProps = {
    getApiKeys: () => void,
    getStreams: () => void,
    onClose: () => void,
}

const mapStateToProps = (state: StoreState, { match: { params: { id, streamId } } }: OwnProps): StateProps => ({
    streams: selectProductStreams(state),
    currentUser: selectUserData(state),
    authApiKeyId: selectAuthApiKeyId(state),
    productId: id,
    streamId,
})

const mapDispatchToProps = (dispatch: Function, { match: { params: { id: productId } } }: OwnProps): DispatchProps => ({
    getApiKeys: () => dispatch(getMyResourceKeys()),
    getStreams: () => dispatch(getStreamsByProductId(productId)),
    onClose: () => {
        const route = routes.product({
            id: productId,
        })
        return dispatch(push(route))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamPreviewPage)
