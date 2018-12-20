// @flow

import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import { connect } from 'react-redux'

import type { IntegrationKeyId, IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import { createIntegrationKey, deleteIntegrationKey, fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import IntegrationKeyHandlerSegment from './IntegrationKeyHandlerSegment'
import { selectPrivateKeys, selectIntegrationKeysError } from '$shared/modules/integrationKey/selectors'
import type { Address } from '$shared/flowtype/web3-types'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'

type StateProps = {
    integrationKeys: ?IntegrationKeyList,
}

type DispatchProps = {
    deleteIntegrationKey: (id: IntegrationKeyId) => void,
    createIntegrationKey: (name: string, privateKey: Address) => void,
    getIntegrationKeys: () => void
}

type Props = StateProps & DispatchProps

export class IntegrationKeyHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeys()
    }

    onNew = (name: string, privateKey: string) => {
        this.props.createIntegrationKey(name, privateKey)
    }

    onDelete = (id: IntegrationKeyId) => {
        this.props.deleteIntegrationKey(id)
    }

    render() {
        return (
            <Fragment>
                <p>
                    These Ethereum accounts can be used on Canvases to build
                    data-driven interactions with Ethereum. Even though the private
                    keys are securely stored server-side, we do not recommend having
                    significant amounts of value on these accounts.
                </p>
                <IntegrationKeyHandlerSegment
                    integrationKeys={this.props.integrationKeys || []}
                    onNew={this.onNew}
                    onDelete={this.onDelete}
                    hideValues
                    createWithValue
                />
                <AddKeyField
                    label={I18n.t('userpages.profilePage.ethereumAddress.addNewAddress')}
                    onSave={this.onNew}
                    createWithValue
                />
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    integrationKeys: selectPrivateKeys(state),
    error: selectIntegrationKeysError(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteIntegrationKey(id: IntegrationKeyId) {
        dispatch(deleteIntegrationKey(id))
    },
    createIntegrationKey(name: string, privateKey: Address) {
        dispatch(createIntegrationKey(name, privateKey))
    },
    getIntegrationKeys() {
        dispatch(fetchIntegrationKeys())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationKeyHandler)
