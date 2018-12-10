// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getResourceKeys, addResourceKey, removeResourceKey } from '../../../modules/key/actions'

import type { Key } from '../../../flowtype/key-types'
import type { KeyState } from '../../../flowtype/states/key-state'

import CredentialsControl from './CredentialsControl'

type StateProps = {
    keys: Array<Key>
}

type DispatchProps = {
    getKeys: () => void,
    addKey: (key: string) => void,
    removeKey: (keyId: $ElementType<Key, 'id'>) => void
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

const mapStateToProps = ({ key }: { key: KeyState }): StateProps => {
    const keys = (key.byTypeAndId.USER || {}).me || []
    return {
        keys,
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys() {
        dispatch(getResourceKeys('USER', 'me'))
    },
    addKey(key: string) {
        dispatch(addResourceKey('USER', 'me', {
            name: key,
        }))
    },
    removeKey(keyId: $ElementType<Key, 'id'>) {
        dispatch(removeResourceKey('USER', 'me', keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(APICredentials)
