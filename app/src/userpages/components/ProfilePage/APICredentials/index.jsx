// @flow

import React, { Component, Fragment } from 'react'
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
    addKey: (key: Key) => void,
    removeKey: (keyId: $ElementType<Key, 'id'>) => void
}

type Props = StateProps & DispatchProps

export class APICredentials extends Component<Props> {
    componentWillMount() {
        this.props.getKeys()
    }

    render() {
        const keys = this.props.keys.sort((a, b) => a.name.localeCompare(b.name))
        return (
            <Fragment>
                <h1>API Keys</h1>
                <CredentialsControl
                    keys={keys}
                    addKey={this.props.addKey}
                    removeKey={this.props.removeKey}
                    permissionTypeVisible={false}
                />
            </Fragment>
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
    addKey(key: Key) {
        dispatch(addResourceKey('USER', 'me', key))
    },
    removeKey(keyId: $ElementType<Key, 'id'>) {
        dispatch(removeResourceKey('USER', 'me', keyId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(APICredentials)
