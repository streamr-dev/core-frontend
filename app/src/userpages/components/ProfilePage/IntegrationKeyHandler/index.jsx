// @flow

import React, { Component, Fragment } from 'react'
import { Row } from 'reactstrap'

import { connect } from 'react-redux'
import type { IntegrationKey } from '../../../flowtype/integration-key-types'
import { createIntegrationKey, deleteIntegrationKey, getIntegrationKeysByService } from '../../../modules/integrationKey/actions'
import type { IntegrationKeyState } from '../../../flowtype/states/integration-key-state'
import IntegrationKeyHandlerSegment from './IntegrationKeyHandlerSegment'

type StateProps = {
    integrationKeys: Array<IntegrationKey>,
}

type DispatchProps = {
    deleteIntegrationKey: (id: $ElementType<IntegrationKey, 'id'>) => void,
    createIntegrationKey: (key: IntegrationKey) => void,
    getIntegrationKeysByService: (service: $ElementType<IntegrationKey, 'service'>) => void
}

type Props = StateProps & DispatchProps

const service = 'ETHEREUM'

export class IntegrationKeyHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeysByService(service)
    }

    onNew = (integrationKey: IntegrationKey) => {
        const { name } = integrationKey
        delete integrationKey.name // eslint-disable-line no-param-reassign
        return this.props.createIntegrationKey({
            name,
            service,
            json: integrationKey,
        })
    }

    onDelete = (id: $ElementType<IntegrationKey, 'id'>) => {
        this.props.deleteIntegrationKey(id)
    }

    render() {
        return (
            <Fragment>
                <h1>Ethereum Private Keys</h1>
                <p>
                    These Ethereum accounts can be used on Canvases to build
                    data-driven interactions with Ethereum. Even though the private
                    keys are securely stored server-side, we do not recommend having
                    significant amounts of value on these accounts.
                </p>
                <Row>
                    <IntegrationKeyHandlerSegment
                        integrationKeys={this.props.integrationKeys}
                        onNew={this.onNew}
                        onDelete={this.onDelete}
                        service={service}
                        copy="address"
                        inputFields={['privateKey']}
                        tableFields={[
                            ['address', (add) => (
                                (add && typeof add === 'string') ? `${add.substring(0, 15)}...` : add
                            )],
                        ]}
                    />
                </Row>
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
    createIntegrationKey(key: IntegrationKey) {
        dispatch(createIntegrationKey(key))
    },
    getIntegrationKeysByService(serviceName: $ElementType<IntegrationKey, 'service'>) {
        dispatch(getIntegrationKeysByService(serviceName))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationKeyHandler)
