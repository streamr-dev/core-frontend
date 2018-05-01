// @flow

import React, { type ComponentType } from 'react'
import { connect } from 'react-redux'

import { selectEnabled, selectAccountId } from '../../modules/web3/selectors'
import { selectEthereumNetworkIsCorrect, selectEthereumNetworkError } from '../../modules/global/selectors'
import { hideModal } from '../../modules/modals/actions'
import UnlockWalletDialog from '../../components/Modal/UnlockWalletDialog'
import ChangeNetworkDialog from '../../components/Modal/ChangeNetworkDialog'
import TransactionError from '../../errors/TransactionError'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'

type StateProps = {
    walletEnabled: boolean,
    correctNetwork: ?boolean,
    networkError: ?TransactionError,
    accountId: ?Address,
}

type DispatchProps = {
    onCancel: () => void,
}

type OwnProps = {
    requireWeb3: boolean,
    requiredOwnerAddress?: Address,
    onCancel: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

export function withWeb3(WrappedComponent: ComponentType<any>, lightBackdrop: boolean = false) {
    const mapStateToProps = (state: StoreState): StateProps => ({
        walletEnabled: selectEnabled(state),
        correctNetwork: selectEthereumNetworkIsCorrect(state),
        networkError: selectEthereumNetworkError(state),
        accountId: selectAccountId(state),
    })

    const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
        onCancel: () => {
            if (ownProps.onCancel) {
                ownProps.onCancel()
            } else {
                dispatch(hideModal())
            }
        },
    })

    const Component = (props: Props) => {
        const {
            requireWeb3,
            walletEnabled,
            correctNetwork,
            networkError,
            accountId,
            requiredOwnerAddress,
            onCancel,
        } = props

        if (requireWeb3) {
            if (!walletEnabled) {
                return (
                    <UnlockWalletDialog
                        lightBackdrop={lightBackdrop}
                        onCancel={onCancel}
                    />
                )
            }

            if (!correctNetwork) {
                return (
                    <ChangeNetworkDialog
                        message={(networkError && networkError.message) || ''}
                        lightBackdrop={lightBackdrop}
                        onCancel={onCancel}
                    />
                )
            }

            if (requiredOwnerAddress && accountId !== requiredOwnerAddress) {
                return (
                    <UnlockWalletDialog
                        lightBackdrop={lightBackdrop}
                        onCancel={onCancel}
                        message={`Please select the account with address ${requiredOwnerAddress}`}
                    />
                )
            }
        }

        return (
            <WrappedComponent {...props} />
        )
    }

    Component.defaultProps = {
        requireWeb3: true,
        requiredOwnerAddress: null,
    }

    return connect(mapStateToProps, mapDispatchToProps)(Component)
}

export default withWeb3
