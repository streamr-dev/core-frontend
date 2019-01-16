// @flow

import React from 'react'
import { connect } from 'react-redux'

import withWeb3 from '$shared/utils/withWeb3'
import { createIdentity } from '$shared/modules/integrationKey/actions'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { IntegrationKey, IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Address } from '$shared/flowtype/web3-types'

import IdentityNameDialog from '../IdentityNameDialog'
import IdentityChallengeDialog from '../IdentityChallengeDialog'
import DuplicateIdentityDialog from '../IdentityChallengeDialog/DuplicateIdentityDialog'

type OwnProps = {
    onClose: () => void,
}

type StateProps = {
    accountId: ?Address,
    ethereumIdentities: ?IntegrationKeyList,
}

type DispatchProps = {
    createIdentity: (name: string) => ApiResult<IntegrationKey>,
}

type Props = OwnProps & StateProps & DispatchProps

const identityPhases = {
    NAME: 'name',
    CHALLENGE: 'challenge',
    COMPLETE: 'complete',
}

type State = {
    phase: $Values<typeof identityPhases>,
}

class AddIdentityDialog extends React.Component<Props, State> {
    state = {
        phase: identityPhases.NAME,
    }

    onSetName = (name: string) => {
        this.setState({
            phase: identityPhases.CHALLENGE,
        })

        try {
            this.props.createIdentity(name)
        } catch (e) {
            console.warn(e)
        }
    }

    render() {
        const { onClose, accountId, ethereumIdentities } = this.props

        switch (this.state.phase) {
            case identityPhases.NAME: {
                // Check if account is already linked and show an error.
                const accountLinked = !!(ethereumIdentities &&
                    accountId &&
                    ethereumIdentities.find((account) =>
                        account.json && account.json.address && areAddressesEqual(account.json.address, accountId))
                )

                if (accountLinked) {
                    return (
                        <DuplicateIdentityDialog
                            onClose={onClose}
                        />
                    )
                }

                return (
                    <IdentityNameDialog
                        onClose={onClose}
                        onSave={this.onSetName}
                    />
                )
            }

            case identityPhases.CHALLENGE:
                return (
                    <IdentityChallengeDialog
                        onClose={onClose}
                    />
                )
            default:
                return null
        }
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    accountId: selectAccountId(state),
    ethereumIdentities: selectEthereumIdentities(state),
})

const mapDispatchToProps = (dispatch: Function) => ({
    createIdentity: (name: string) => dispatch(createIdentity(name)),
})

export default withWeb3(connect(mapStateToProps, mapDispatchToProps)(AddIdentityDialog))
