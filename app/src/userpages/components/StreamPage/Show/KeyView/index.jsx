// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Label, FormGroup } from 'reactstrap'
import CredentialsControl from '../../../ProfilePage/APICredentials/CredentialsControl'

import { addResourceKey, removeResourceKey, getResourceKeys } from '../../../../modules/key/actions'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { Key } from '../../../../flowtype/key-types'
import { selectOpenStreamId } from '$userpages/modules/userPageStreams/selectors'

type StateProps = {
    streamId: ?StreamId,
    keys: Array<Key>
}

type DispatchProps = {
    getKeys: (streamId: StreamId) => void,
    addKey: (streamId: StreamId, key: string) => void,
    removeKey: (streamId: StreamId, keyId: $ElementType<Key, 'id'>) => void
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

    addKey = (key: string) => {
        if (this.props.streamId) {
            this.props.addKey(this.props.streamId, key)
        }
    }

    removeKey = (keyId: $ElementType<Key, 'id'>) => {
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

export const mapStateToProps = (state: StoreState): StateProps => {
    const streamId = selectOpenStreamId(state)
    const streamKeys = state.key.byTypeAndId.STREAM || {}
    const currentStreamKeys = (streamId && streamKeys[streamId]) || []
    return {
        streamId,
        keys: currentStreamKeys,
    }
}

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys(streamId: StreamId) {
        dispatch(getResourceKeys('STREAM', streamId))
    },
    addKey(streamId: StreamId, key: string) {
        dispatch(addResourceKey('STREAM', streamId, {
            name: key,
        }))
    },
    removeKey(streamId: StreamId, keyId: $ElementType<Key, 'id'>) {
        dispatch(removeResourceKey('STREAM', streamId, keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
