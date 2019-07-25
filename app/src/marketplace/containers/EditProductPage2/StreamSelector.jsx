// @flow

import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import type { StoreState } from '$shared/flowtype/store-state'
import StreamSelectorComponent from '$mp/components/StreamSelector'
import { getStreams as getStreamsAction } from '$mp/modules/streams/actions'
import { selectStreams, selectFetchingStreams } from '$mp/modules/streams/selectors'
import type { StreamList } from '$shared/flowtype/stream-types'

export type StateProps = {
    streams: StreamList,
    fetching: boolean,
}

export type DispatchProps = {
    getStreams: () => void,
}

type Props = StateProps & DispatchProps & {
    children?: Function,
}

const StreamsComponent = ({ children, fetching, streams, getStreams }: Props) => {
    useEffect(() => {
        getStreams()
    }, [getStreams])

    return children ? children(fetching, streams) : null
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    streams: selectStreams(state),
    fetching: selectFetchingStreams(state),
    // streamsError: selectStreamsError(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getStreams: () => dispatch(getStreamsAction()),
})

const Streams = connect(mapStateToProps, mapDispatchToProps)(StreamsComponent)

const StreamSelector = () => (
    <div>
        <h1>Add streams</h1>
        <p>Products can contain a range of streams, or a single &quot;firehose&quot; type stream, it&apos;s up to you.
            If you haven&apos;t made any streams yet, you can create one here. For help creating streams, see the docs.
        </p>
        <Streams>
            {(fetching, streams) => (
                <StreamSelectorComponent
                    availableStreams={streams}
                    fetchingStreams={fetching}
                    onEdit={() => {}}
                    streams={[]}
                />
            )}
        </Streams>
    </div>
)

export default StreamSelector
