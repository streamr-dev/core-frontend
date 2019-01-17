// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import CredentialsControl from '../../../ProfilePage/APICredentials/CredentialsControl'

import { addStreamResourceKey, removeStreamResourceKey, getStreamResourceKeys } from '$shared/modules/resourceKey/actions'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'
import { selectOpenStreamId, selectOpenStreamResourceKeys } from '$userpages/modules/userPageStreams/selectors'

type StateProps = {
    streamId: ?StreamId,
    keys: Array<ResourceKey>
}

type DispatchProps = {
    getKeys: (streamId: StreamId) => void,
    addKey: (streamId: StreamId, key: string, permission: ResourcePermission) => Promise<void>,
    removeKey: (streamId: StreamId, keyId: ResourceKeyId) => void
}

type Props = StateProps & DispatchProps

export class KeyView extends Component<Props> {
    componentDidMount() {
        if (this.props.streamId) {
            this.props.getKeys(this.props.streamId)
        }
    }

    componentWillReceiveProps(props: Props) {
        if (props.streamId && props.streamId !== this.props.streamId) {
            this.props.getKeys(props.streamId)
        }
    }

    addKey = (key: string): Promise<void> => new Promise((resolve, reject) => {
        if (this.props.streamId) {
            const permission = 'read'
            this.props.addKey(this.props.streamId, key, permission)
                .then(resolve, reject)
        }

        resolve()
    })

    removeKey = (keyId: ResourceKeyId) => {
        if (this.props.streamId) {
            this.props.removeKey(this.props.streamId, keyId)
        }
    }

    render() {
        const keys = this.props.keys || []
        return (
            <Fragment>
                <CredentialsControl
                    keys={keys}
                    addKey={this.addKey}
                    removeKey={this.removeKey}
                    permissionTypeVisible
                />
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    streamId: selectOpenStreamId(state),
    keys: selectOpenStreamResourceKeys(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys(streamId: StreamId) {
        dispatch(getStreamResourceKeys(streamId))
    },
    addKey(streamId: StreamId, key: string, permission: ResourcePermission) {
        return dispatch(addStreamResourceKey(streamId, key, permission))
    },
    removeKey(streamId: StreamId, keyId: ResourceKeyId) {
        dispatch(removeStreamResourceKey(streamId, keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
