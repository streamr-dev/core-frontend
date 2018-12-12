// @flow

import React, { type ComponentType } from 'react'
import { connect } from 'react-redux'

import { selectEnabled } from '$mp/modules/web3/selectors'
import {
    selectEthereumNetworkIsCorrect,
    selectEthereumNetworkError,
    selectMetamaskPermission,
    selectIsWeb3Injected,
} from '$mp/modules/global/selectors'
import { updateMetamaskPermission } from '../../modules/global/actions'
import { hideModal } from '$mp/modules/modals/actions'
import UnlockWalletDialog from '$mp/components/Modal/UnlockWalletDialog'
import Web3NotDetectedDialog from '$mp/components/Modal/Web3/Web3NotDetectedDialog'
import TransactionError from '$shared/errors/TransactionError'
import type { StoreState } from '$shared/flowtype/store-state'

type StateProps = {
    walletEnabled: boolean,
    correctNetwork: ?boolean,
    networkError: ?TransactionError,
    metamaskPermission: ?boolean,
    isWeb3Injected: boolean,
}

type DispatchProps = {
    onCancel: () => void,
    updateMetamaskPermission: (boolean) => void,
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
        updateMetamaskPermission: (metamaskPermission: boolean) => dispatch(updateMetamaskPermission(metamaskPermission)),
    })
    class WithWeb3 extends React.Component<Props> {
        static defaultProps = {
            requireWeb3: true,
        }

        componentDidMount() {
            // This is the request to allow this domain to access the
            // metamask public web3 account information.
            if (!this.props.metamaskPermission) {
                this.requestMetamaskAccess(true)
            }
        }

        requestMetamaskAccess(askPermission: boolean = false) {
            // Checks for legacy access. Asks to unlock if possible.
            return Promise.resolve()
                .then(() => {
                    if (!window.web3 && !window.ethereum) {
                        throw new Error('Metamask not detected')
                    }
                    return window.web3.eth.defaultAccount || (askPermission ? window.ethereum.enable() : undefined)
                })
                .then((account) => {
                    if (account) {
                        this.props.updateMetamaskPermission(true)
                    }
                }, (err) => {
                    console.warn(err)
                    this.props.updateMetamaskPermission(false)
                })
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
                            onClose={onCancel}
                        />
                    )
                }
                if (!walletEnabled) {
                    return (
                        <UnlockWalletDialog
                            onClose={onCancel}
                            message="Please unlock your wallet or install Metamask"
                        />
                    )
                }

                if (!correctNetwork) {
                    return (
                        <UnlockWalletDialog
                            message={(networkError && networkError.message) || ''}
                            onClose={onCancel}
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
