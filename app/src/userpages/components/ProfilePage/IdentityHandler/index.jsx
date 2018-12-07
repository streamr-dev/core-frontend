// @flow

import React, { Component, Fragment } from 'react'
import { Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import IntegrationKeyHandlerSegment from '../IntegrationKeyHandler/IntegrationKeyHandlerSegment'
import type { NewIntegrationKey, IntegrationKey, IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { deleteIntegrationKey, fetchIntegrationKeys, createIdentity } from '$shared/modules/integrationKey/actions'
import { selectEthereumIdentities, selectIntegrationKeysError } from '$shared/modules/integrationKey/selectors'
import getWeb3 from '../../../utils/web3Provider'

import styles from './identityHandler.pcss'

type StateProps = {
    integrationKeys: ?IntegrationKeyList,
}

type DispatchProps = {
    createIdentity: (integrationKey: NewIntegrationKey) => void,
    deleteIntegrationKey: (id: $ElementType<IntegrationKey, 'id'>) => void,
    getIntegrationKeys: () => void
}

type Props = StateProps & DispatchProps

const service = 'ETHEREUM_ID'

export class IdentityHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeys()
    }

    onNew = (name: string) => {
        this.props.createIdentity({
            name,
            service,
            json: {},
        })
    }

    onDelete = (id: $ElementType<IntegrationKey, 'id'>) => {
        this.props.deleteIntegrationKey(id)
    }

    render() {
        const hasWeb3 = getWeb3().isEnabled()
        return (
            <Fragment>
                <div className={styles.description}>
                    <Translate value="userpages.profilePage.ethereumAddress.description" />
                </div>
                <IntegrationKeyHandlerSegment
                    onNew={this.onNew}
                    onDelete={this.onDelete}
                    service={service}
                    integrationKeys={this.props.integrationKeys || []}
                    showInput={hasWeb3}
                />
                {!hasWeb3 && (
                    <Alert color="danger">
                        <Translate
                            value="userpages.profilePage.ethereumAddress.notMetamaskEnabledBrowser"
                            dangerousHTML
                        />
                    </Alert>
                )}
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    integrationKeys: selectEthereumIdentities(state),
    error: selectIntegrationKeysError(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteIntegrationKey(id: $ElementType<IntegrationKey, 'id'>) {
        dispatch(deleteIntegrationKey(id))
    },
    createIdentity(integrationKey: NewIntegrationKey) {
        dispatch(createIdentity(integrationKey))
    },
    getIntegrationKeys() {
        dispatch(fetchIntegrationKeys())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IdentityHandler)
