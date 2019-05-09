// @flow

import React, { Component, Fragment } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import styles from '../profilePage.pcss'

import type { IntegrationKeyId, IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import { createIntegrationKey, deleteIntegrationKey, fetchIntegrationKeys, editIntegrationKey } from '$shared/modules/integrationKey/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import IntegrationKeyHandlerSegment from './IntegrationKeyHandlerSegment'
import { selectPrivateKeys, selectIntegrationKeysError } from '$shared/modules/integrationKey/selectors'
import type { Address } from '$shared/flowtype/web3-types'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'

type StateProps = {
    integrationKeys: IntegrationKeyList,
}

type DispatchProps = {
    deleteIntegrationKey: (keyId: IntegrationKeyId) => Promise<void>,
    createIntegrationKey: (name: string, privateKey: Address) => Promise<void>,
    editIntegrationKey: (keyId: IntegrationKeyId, keyName: string) => Promise<void>,
    getIntegrationKeys: () => void
}

type Props = StateProps & DispatchProps

export class IntegrationKeyHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeys()
    }

    onNew = (keyName: string, privateKey: string): Promise<void> => this.props.createIntegrationKey(keyName, privateKey)

    onDelete = (keyId: IntegrationKeyId): Promise<void> => this.props.deleteIntegrationKey(keyId)

    onEdit = (keyId: IntegrationKeyId, keyName: string): Promise<void> => this.props.editIntegrationKey(keyId, keyName)

    render() {
        return (
            <Fragment>
                <Translate value="userpages.profilePage.ethereumPrivateKeys.description" tag="p" className={styles.longText} />
                <IntegrationKeyHandlerSegment
                    integrationKeys={this.props.integrationKeys}
                    onNew={this.onNew}
                    onDelete={this.onDelete}
                    onEdit={this.onEdit}
                    hideValues
                    createWithValue
                />
                <AddKeyField
                    label={this.props.integrationKeys && this.props.integrationKeys[0]
                        ? I18n.t('userpages.profilePage.ethereumAddress.addNewAddress')
                        : I18n.t('userpages.profilePage.ethereumAddress.addAddress')
                    }
                    onSave={this.onNew}
                    createWithValue
                    addKeyFieldAllowed
                />
            </Fragment>
        )
    }
}

const EMPTY = []

export const mapStateToProps = (state: StoreState): StateProps => ({
    integrationKeys: selectPrivateKeys(state) || EMPTY,
    error: selectIntegrationKeysError(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteIntegrationKey: (keyId: IntegrationKeyId): Promise<void> => dispatch(deleteIntegrationKey(keyId)),
    createIntegrationKey: (keyName: string, privateKey: Address): Promise<void> => dispatch(createIntegrationKey(keyName, privateKey)),
    getIntegrationKeys() {
        dispatch(fetchIntegrationKeys())
    },
    editIntegrationKey: (keyId: IntegrationKeyId, keyName: string) => dispatch(editIntegrationKey(keyId, keyName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationKeyHandler)
