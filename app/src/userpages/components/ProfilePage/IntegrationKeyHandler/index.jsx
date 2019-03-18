// @flow

import React, { Component, Fragment } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import styles from '../profilePage.pcss'

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
    createIntegrationKey: (name: string, privateKey: Address) => Promise<void>,
    getIntegrationKeys: () => void
}

type Props = StateProps & DispatchProps

export class IntegrationKeyHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeys()
    }

    onNew = (name: string, privateKey: string): Promise<void> => this.props.createIntegrationKey(name, privateKey)

    onDelete = (id: IntegrationKeyId) => {
        this.props.deleteIntegrationKey(id)
    }

    render() {
        return (
            <Fragment>
                <Translate value="userpages.profilePage.ethereumPrivateKeys.description" tag="p" className={styles.longText} />
                <IntegrationKeyHandlerSegment
                    integrationKeys={this.props.integrationKeys || []}
                    onNew={this.onNew}
                    onDelete={this.onDelete}
                    hideValues
                    createWithValue
                />
                <AddKeyField
                    // $FlowFixMe
                    label={this.props.integrationKeys[0] ?
                        I18n.t('userpages.profilePage.ethereumAddress.addNewAddress') :
                        I18n.t('userpages.profilePage.ethereumAddress.addAddress')
                    }
                    onSave={this.onNew}
                    createWithValue
                    addKeyFieldAllowed
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
    createIntegrationKey: (name: string, privateKey: Address): Promise<void> => dispatch(createIntegrationKey(name, privateKey)),
    getIntegrationKeys() {
        dispatch(fetchIntegrationKeys())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationKeyHandler)
