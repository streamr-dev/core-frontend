// @flow

import React, { type ComponentType } from 'react'
import { connect } from 'react-redux'

import { requestMetamaskPermission } from '../../web3/web3Provider'
import { selectEnabled } from '../../modules/web3/selectors'
import {
    selectEthereumNetworkIsCorrect,
    selectEthereumNetworkError,
    selectMetamaskPermission,
    selectIsWeb3Injected,
} from '../../modules/global/selectors'
import { hideModal } from '../../modules/modals/actions'
import UnlockWalletDialog from '../../components/Modal/UnlockWalletDialog'
import Web3NotDetectedDialog from '../../components/Modal/Web3/Web3NotDetectedDialog'
import TransactionError from '../../errors/TransactionError'
import type { StoreState } from '../../flowtype/store-state'

type StateProps = {
    walletEnabled: boolean,
    correctNetwork: ?boolean,
    networkError: ?TransactionError,
    metamaskPermission: ?boolean,
    isWeb3Injected: boolean,
}

type DispatchProps = {
    onCancel: () => void,
}

type OwnProps = {
    requireWeb3: boolean,
    onCancel: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

export function withWeb3(WrappedComponent: ComponentType<any>) {
    const mapStateToProps = (state: StoreState): StateProps => ({
        walletEnabled: selectEnabled(state),
        correctNetwork: selectEthereumNetworkIsCorrect(state),
        networkError: selectEthereumNetworkError(state),
        metamaskPermission: selectMetamaskPermission(state),
        isWeb3Injected: selectIsWeb3Injected(state),
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
    class WithWeb3 extends React.Component<Props> {
        static defaultProps = {
            requireWeb3: true,
        }

        constructor(props: Props) {
            super(props)
            // This is the request to allow this domain to access the
            // metamask public web3 account information.
            if (!this.props.metamaskPermission) {
                requestMetamaskPermission()
            }
        }

        render() {
            const {
                requireWeb3,
                walletEnabled,
                correctNetwork,
                networkError,
                onCancel,
                isWeb3Injected,
            } = this.props

            if (requireWeb3) {
                if (!isWeb3Injected) {
                    return (
                        <Web3NotDetectedDialog
                            onCancel={onCancel}
                        />
                    )
                }
                if (!walletEnabled) {
                    return (
                        <UnlockWalletDialog
                            onCancel={onCancel}
                            message="Please unlock your wallet or install Metamask"
                        />
                    )
                }

                if (!correctNetwork) {
                    return (
                        <UnlockWalletDialog
                            message={(networkError && networkError.message) || ''}
                            onCancel={onCancel}
                        />
                    )
                }
            }

            return (
                <WrappedComponent {...this.props} />
            )
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(WithWeb3)
}

export default withWeb3
