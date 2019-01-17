// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getMyResourceKeys, addMyResourceKey, removeMyResourceKey } from '$shared/modules/resourceKey/actions'
import { selectMyResourceKeys } from '$shared/modules/resourceKey/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyList, ResourceKeyId } from '$shared/flowtype/resource-key-types'

import CredentialsControl from './CredentialsControl'

type StateProps = {
    keys: ResourceKeyList,
}

type DispatchProps = {
    getKeys: () => void,
    addKey: (key: string) => Promise<void>,
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

const mapStateToProps = (state: StoreState): StateProps => ({
    keys: selectMyResourceKeys(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys: () => dispatch(getMyResourceKeys()),
    addKey: (key: string) => dispatch(addMyResourceKey(key)),
    removeKey: (keyId: ResourceKeyId) => dispatch(removeMyResourceKey(keyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(APICredentials)
