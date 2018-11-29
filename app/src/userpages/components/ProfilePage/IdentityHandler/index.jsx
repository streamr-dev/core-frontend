// @flow

import React, { Component, Fragment } from 'react'
import { Row, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import IntegrationKeyHandlerSegment from '../IntegrationKeyHandler/IntegrationKeyHandlerSegment'
import type { IntegrationKey } from '../../../flowtype/integration-key-types'
import type { IntegrationKeyState } from '../../../flowtype/states/integration-key-state'
import { deleteIntegrationKey, getIntegrationKeysByService, createIdentity } from '../../../modules/integrationKey/actions'
import getWeb3 from '../../../utils/web3Provider'
import KeyField from '$userpages/components/KeyField'

import styles from './identityHandler.pcss'

type StateProps = {
    integrationKeys: Array<IntegrationKey>
}

type DispatchProps = {
    createIdentity: (integrationKey: IntegrationKey) => void,
    deleteIntegrationKey: (id: $ElementType<IntegrationKey, 'id'>) => void,
    getIntegrationKeysByService: (service: $ElementType<IntegrationKey, 'service'>) => void
}

type Props = StateProps & DispatchProps

const service = 'ETHEREUM_ID'

export class IdentityHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeysByService(service)
    }

    onNew = (integrationKey: IntegrationKey) => {
        const { name } = integrationKey
        delete integrationKey.name // eslint-disable-line no-param-reassign
        this.props.createIdentity({
            name,
            service,
            json: integrationKey,
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
                <div className={styles.keyList}>
                    {this.props.integrationKeys.map((key: IntegrationKey) => (
                        <KeyField
                            className={styles.singleKey}
                            key={key.id}
                            keyName={key.name}
                            // $FlowFixMe
                            value={(key.json || {}).address || ''}
                            onSave={() => {
                                alert('Editing is not supported yet!') // eslint-disable-line no-alert
                            }}
                            onDelete={() => {}}
                        />
                    ))}
                </div>
                <Row>
                    <IntegrationKeyHandlerSegment
                        onNew={this.onNew}
                        onDelete={this.onDelete}
                        service={service}
                        integrationKeys={this.props.integrationKeys}
                        copy="address"
                        showInput={hasWeb3}
                        tableFields={[
                            ['address', (add) => (
                                (add && typeof add === 'string') ? `${add.substring(0, 15)}...` : add
                            )],
                        ]}
                    />
                </Row>
                {!hasWeb3 && (
                    <Alert color="danger">
                        To bind Ethereum addresses to your Streamr account, you need an Ethereum-enabled browser.
                        Try the <a href="https://metamask.io">MetaMask plugin for Chrome</a> or
                        the <a href="https://github.com/ethereum/mist/releases">Mist browser</a>.
                    </Alert>
                )}
            </Fragment>
        )
    }
}

export const mapStateToProps = ({ integrationKey: { listsByService, error } }: {integrationKey: IntegrationKeyState}): StateProps => ({
    integrationKeys: listsByService[service] || [],
    error,
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteIntegrationKey(id: $ElementType<IntegrationKey, 'id'>) {
        dispatch(deleteIntegrationKey(id))
    },
    createIdentity(integrationKey: IntegrationKey) {
        dispatch(createIdentity(integrationKey))
    },
    getIntegrationKeysByService(serviceName: $ElementType<IntegrationKey, 'service'>) {
        dispatch(getIntegrationKeysByService(serviceName))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IdentityHandler)
