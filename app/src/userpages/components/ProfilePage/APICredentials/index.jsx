// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import { getMyResourceKeys, addMyResourceKey, removeMyResourceKey } from '$shared/modules/resourceKey/actions'
import { selectMyResourceKeys } from '$shared/modules/resourceKey/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyList, ResourceKeyId } from '$shared/flowtype/resource-key-types'

import CredentialsControl from './CredentialsControl'
import styles from './apiCredentials.pcss'

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
    componentDidMount() {
        this.props.getKeys()
    }

    render() {
        const { addKey, removeKey } = this.props
        const keys = this.props.keys.sort((a, b) => a.name.localeCompare(b.name))
        return (
            <Fragment>
                <div className={styles.description}>
                    <Translate value="userpages.profilePage.apiCredentials.description" />
                </div>
                <CredentialsControl
                    keys={keys}
                    addKey={addKey}
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
    addKey: (key: string) => dispatch(addMyResourceKey(key)),
    removeKey: (keyId: ResourceKeyId) => dispatch(removeMyResourceKey(keyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(APICredentials)
