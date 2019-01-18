// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import IntegrationKeyHandlerSegment from '../IntegrationKeyHandler/IntegrationKeyHandlerSegment'
import type { IntegrationKeyId, IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { deleteIntegrationKey, fetchIntegrationKeys, createIdentity } from '$shared/modules/integrationKey/actions'
import { selectEthereumIdentities, selectIntegrationKeysError } from '$shared/modules/integrationKey/selectors'
import AddIdentityButton from './AddIdentityButton'
import styles from './identityHandler.pcss'

type StateProps = {
    integrationKeys: ?IntegrationKeyList,
}

type DispatchProps = {
    createIdentity: (name: string) => Promise<void>,
    deleteIntegrationKey: (id: IntegrationKeyId) => void,
    getIntegrationKeys: () => void
}

type Props = StateProps & DispatchProps

export class IdentityHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeys()
    }

    onNew = (name: string): Promise<void> => this.props.createIdentity(name)

    onDelete = (id: IntegrationKeyId) => {
        this.props.deleteIntegrationKey(id)
    }

    render() {
        return (
            <Fragment>
                <Translate
                    tag="div"
                    value="userpages.profilePage.ethereumAddress.description"
                    className={styles.description}
                />
                <IntegrationKeyHandlerSegment
                    onDelete={this.onDelete}
                    integrationKeys={this.props.integrationKeys || []}
                />
                <AddIdentityButton />
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    integrationKeys: selectEthereumIdentities(state),
    error: selectIntegrationKeysError(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteIntegrationKey(id: IntegrationKeyId) {
        dispatch(deleteIntegrationKey(id))
    },
    createIdentity: (name: string) => dispatch(createIdentity(name)),
    getIntegrationKeys() {
        dispatch(fetchIntegrationKeys())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IdentityHandler)
