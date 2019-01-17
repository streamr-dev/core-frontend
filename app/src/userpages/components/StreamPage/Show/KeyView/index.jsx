// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Label, FormGroup } from 'reactstrap'
import CredentialsControl from '../../../ProfilePage/APICredentials/CredentialsControl'

import { addStreamResourceKey, removeStreamResourceKey, getStreamResourceKeys } from '$shared/modules/resourceKey/actions'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyId, ResourceKey } from '$shared/flowtype/resource-key-types'
import { selectOpenStreamId, selectOpenStreamResourceKeys } from '$userpages/modules/userPageStreams/selectors'

type StateProps = {
    streamId: ?StreamId,
    keys: Array<ResourceKey>
}

type DispatchProps = {
    getKeys: (streamId: StreamId) => void,
    addKey: (streamId: StreamId, key: string) => Promise<void>,
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
            this.props.addKey(this.props.streamId, key)
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
        return (
            <Fragment>
                <h1>API Credentials</h1>
                <FormGroup>
                    <Label>Id</Label>
                    <div className="stream-id">{this.props.streamId}</div>
                </FormGroup>
                <FormGroup>
                    <Label>Anonymous Keys</Label>
                    <CredentialsControl
                        keys={this.props.keys || []}
                        addKey={this.addKey}
                        removeKey={this.removeKey}
                        permissionTypeVisible
                    />
                </FormGroup>
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
    addKey(streamId: StreamId, key: string) {
        return dispatch(addStreamResourceKey(streamId, key))
    },
    removeKey(streamId: StreamId, keyId: ResourceKeyId) {
        dispatch(removeStreamResourceKey(streamId, keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
