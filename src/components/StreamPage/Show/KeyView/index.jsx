// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel, ControlLabel, FormGroup } from 'react-bootstrap'
import CredentialsControl from '../../../ProfilePage/APICredentials/CredentialsControl'

import { addResourceKey, removeResourceKey, getResourceKeys } from '../../../../modules/key/actions'

import type { Stream } from '../../../../flowtype/stream-types'
import type { StreamState } from '../../../../flowtype/states/stream-state'
import type { Key } from '../../../../flowtype/key-types'
import type { KeyState } from '../../../../flowtype/states/key-state'

type StateProps = {
    streamId: ?$ElementType<Stream, 'id'>,
    keys: Array<Key>
}

type DispatchProps = {
    getKeys: (streamId: $ElementType<Stream, 'id'>) => void,
    addKey: (streamId: $ElementType<Stream, 'id'>, key: Key) => void,
    removeKey: (streamId: $ElementType<Stream, 'id'>, keyId: $ElementType<Key, 'id'>) => void
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

    addKey = (key: Key) => {
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
            <Panel>
                <Panel.Heading>
                    API Credentials
                </Panel.Heading>
                <Panel.Body>
                    <FormGroup>
                        <ControlLabel>Id</ControlLabel>
                        <div>{this.props.streamId}</div>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Anonymous Keys</ControlLabel>
                        <CredentialsControl
                            keys={this.props.keys || []}
                            addKey={this.addKey}
                            removeKey={this.removeKey}
                            permissionTypeVisible
                        />
                    </FormGroup>
                </Panel.Body>
            </Panel>
        )
    }
}

export const mapStateToProps = ({ stream, key }: {stream: StreamState, key: KeyState}): StateProps => {
    const streamId = stream.openStream.id
    const streamKeys = key.byTypeAndId.STREAM || {}
    const currentStreamKeys = (streamId && streamKeys[streamId]) || []
    return {
        streamId,
        keys: currentStreamKeys,
    }
}

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys(streamId: $ElementType<Stream, 'id'>) {
        dispatch(getResourceKeys('STREAM', streamId))
    },
    addKey(streamId: $ElementType<Stream, 'id'>, key: Key) {
        dispatch(addResourceKey('STREAM', streamId, key))
    },
    removeKey(streamId: $ElementType<Stream, 'id'>, keyId: $ElementType<Key, 'id'>) {
        dispatch(removeResourceKey('STREAM', streamId, keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
