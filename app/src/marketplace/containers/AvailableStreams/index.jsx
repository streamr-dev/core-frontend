// @flow

import { useEffect } from 'react'
import { connect } from 'react-redux'

import type { StoreState } from '$shared/flowtype/store-state'
import { getStreams as getStreamsAction } from '$mp/modules/streams/actions'
import { selectStreams, selectFetchingStreams, selectStreamsError } from '$mp/modules/streams/selectors'
import type { StreamList } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type StateProps = {
    fetching: boolean,
    error: ?ErrorInUi,
    streams: ?StreamList,
}

export type DispatchProps = {
    getStreams: () => void,
}

type Props = StateProps & DispatchProps & {
    children: Function,
}

const AvailableStreams = ({
    children,
    fetching,
    streams,
    error,
    getStreams,
}: Props) => {
    if (!children || typeof children !== 'function') {
        throw new Error('children needs to be a function!')
    }

    useEffect(() => {
        getStreams()
    }, [getStreams])

    return children ? children({
        fetching,
        error,
        streams,
    }) : null
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    streams: selectStreams(state),
    fetching: selectFetchingStreams(state),
    error: selectStreamsError(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getStreams: () => dispatch(getStreamsAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AvailableStreams)
