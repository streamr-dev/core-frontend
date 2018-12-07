// @flow

import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import type { NewIntegrationKey, IntegrationKeyId, IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import { createIntegrationKey, deleteIntegrationKey, fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import IntegrationKeyHandlerSegment from './IntegrationKeyHandlerSegment'
import { selectPrivateKeys, selectIntegrationKeysError } from '$shared/modules/integrationKey/selectors'

type StateProps = {
    integrationKeys: ?IntegrationKeyList,
}

type DispatchProps = {
    deleteIntegrationKey: (id: IntegrationKeyId) => void,
    createIntegrationKey: (key: NewIntegrationKey) => void,
    getIntegrationKeys: () => void
}

type Props = StateProps & DispatchProps

const service = 'ETHEREUM'

export class IntegrationKeyHandler extends Component<Props> {
    componentDidMount() {
        // TODO: Move to (yet non-existent) router
        this.props.getIntegrationKeys()
    }

    onNew = (name: string) => {
        this.props.createIntegrationKey({
            name,
            service,
            json: {},
        })
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
                    service={service}
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
    createIntegrationKey(key: NewIntegrationKey) {
        dispatch(createIntegrationKey(key))
    },
    getIntegrationKeys() {
        dispatch(fetchIntegrationKeys())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationKeyHandler)
