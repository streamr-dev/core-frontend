// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getMyResourceKeys, addResourceKey, removeResourceKey } from '$shared/modules/resourceKey/actions'

import type { ResourceKey, ResourceKeyId } from '$shared/flowtype/resource-key-types'
import type { ResourceKeyState } from '$shared/flowtype/store-state'

import CredentialsControl from './CredentialsControl'

type StateProps = {
    keys: Array<ResourceKey>
}

type DispatchProps = {
    getKeys: () => void,
    addKey: (key: string) => void,
    removeKey: (keyId: ResourceKeyId) => void
}

type Props = StateProps & DispatchProps

export class APICredentials extends Component<Props> {
    componentWillMount() {
        this.props.getKeys()
    }

    render() {
        const { addKey, removeKey } = this.props
        const keys = this.props.keys.sort((a, b) => a.name.localeCompare(b.name))
        return (
            <CredentialsControl
                keys={keys}
                addKey={addKey}
                removeKey={removeKey}
                permissionTypeVisible={false}
            />
        )
    }
}

const mapStateToProps = ({ key }: { key: ResourceKeyState }): StateProps => {
    const keys = (key.byTypeAndId.USER || {}).me || []
    return {
        keys,
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys() {
        dispatch(getMyResourceKeys())
    },
    addKey(key: string) {
        return dispatch(addResourceKey('USER', 'me', {
            name: key,
            type: 'USER',
        }))
    },
    removeKey(keyId: ResourceKeyId) {
        dispatch(removeResourceKey('USER', 'me', keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(APICredentials)
