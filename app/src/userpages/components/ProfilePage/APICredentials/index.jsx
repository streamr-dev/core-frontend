// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import {
    getMyResourceKeys,
    addMyResourceKey,
    editMyResourceKey,
    removeMyResourceKey,
    editStreamResourceKey,
} from '$shared/modules/resourceKey/actions'
import { selectMyResourceKeys } from '$shared/modules/resourceKey/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyList, ResourceKeyId, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

import styles from '../profilePage.pcss'

import CredentialsControl from './CredentialsControl'

type StateProps = {
    keys: ResourceKeyList,
}

type DispatchProps = {
    getKeys: () => void,
    addKey: (keyName: string) => Promise<void>,
    editMyResourceKey?: (keyId: ResourceKeyId, keyname: string) => Promise<void>,
    editStreamResourceKey?: (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission) => Promise<void>,
    removeKey: (keyId: ResourceKeyId) => Promise<void>
}

type Props = StateProps & DispatchProps

export class APICredentials extends Component<Props> {
    componentDidMount() {
        this.props.getKeys()
    }

    render() {
        const { addKey, editStreamResourceKey, editMyResourceKey, removeKey } = this.props
        const keys = this.props.keys.sort((a, b) => a.name.localeCompare(b.name))
        return (
            <Fragment>
                <Translate
                    value="userpages.profilePage.apiCredentials.description"
                    tag="p"
                    className={styles.longText}
                />
                <CredentialsControl
                    keys={keys}
                    addKey={addKey}
                    editMyResourceKey={editMyResourceKey}
                    editStreamResourceKey={editStreamResourceKey}
                    removeKey={removeKey}
                    disableDelete={keys.length <= 1}
                    showPermissionType={false}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    keys: selectMyResourceKeys(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys: () => dispatch(getMyResourceKeys()),
    addKey: (keyName: string) => dispatch(addMyResourceKey(keyName)),
    editMyResourceKey: (keyId: ResourceKeyId, keyName: string) => dispatch(editMyResourceKey(keyId, keyName)),
    editStreamResourceKey: (streamId: StreamId, keyId: ResourceKeyId, keyname: string, keyPermission: ResourcePermission) =>
        dispatch(editStreamResourceKey(streamId, keyId, keyname, keyPermission)),
    removeKey: (keyId: ResourceKeyId) => dispatch(removeMyResourceKey(keyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(APICredentials)
