// @flow

import { connect } from 'react-redux'
import { goBack } from 'connected-react-router'

import type { StoreState } from '$shared/flowtype/store-state'
import type { StreamList, StreamId } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import type { ProductId } from '$mp/flowtype/product-types'
import StreamPreviewPage from '$mp/components/StreamPreviewPage'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'
import { getStream, openStream } from '$userpages/modules/userPageStreams/actions'

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
}

type DispatchProps = {
    getStreams: () => void,
    onClose: () => void,
}

const selectStream = (state: StoreState) => {
    const stream = selectOpenStream(state)
    return stream ? [stream] : []
}

const mapStateToProps = (state: StoreState, { match: { params: { streamId } } }: OwnProps): StateProps => ({
    streams: selectStream(state),
    currentUser: selectUserData(state),
    streamId,
})

const mapDispatchToProps = (dispatch: Function, { match: { params: { streamId } } }: OwnProps): DispatchProps => ({
    getStreams: () => {
        dispatch(openStream(streamId))
        return dispatch(getStream(streamId))
    },
    onClose: () => dispatch(goBack()),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamPreviewPage)
