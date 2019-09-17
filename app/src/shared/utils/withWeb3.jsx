// @flow

import React, { type ComponentType } from 'react'

import getWeb3, { validateWeb3 } from '$shared/web3/web3Provider'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import { WalletLockedError } from '$shared/errors/Web3'

import Web3Poller from '$shared/web3/web3Poller'
import type { Props as DialogProps } from '$shared/components/Dialog'

type State = {
    checkingWeb3: boolean,
    web3Error: ?Error,
}

type OwnProps = {
    requireWeb3: boolean,
    onCancel?: () => void,
}

type Props = DialogProps & OwnProps

export function withWeb3(WrappedComponent: ComponentType<any>) {
    class WithWeb3 extends React.Component<Props, State> {
        static defaultProps = {
            requireWeb3: true,
        }

        state = {
            checkingWeb3: false,
            web3Error: undefined,
        }

        componentWillMount() {
            if (this.props.requireWeb3) {
                Web3Poller.subscribe(Web3Poller.events.ACCOUNT_ERROR, this.setLocked)
                Web3Poller.subscribe(Web3Poller.events.ACCOUNT, this.validateWeb3)
                this.validateWeb3()
            }
        }

        componentWillUnmount() {
            this.unmounted = true
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT_ERROR, this.setLocked)
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, this.validateWeb3)
        }

        setLocked = () => {
            if (!this.unmounted) {
                this.setState({
                    checkingWeb3: false,
                    web3Error: new WalletLockedError(),
                })
            }
        }

        unmounted: boolean = false

        validateWeb3 = () => {
            if (!this.props.requireWeb3 || this.state.checkingWeb3 || this.unmounted) {
                return
            }
            this.setState({
                checkingWeb3: true,
                web3Error: null,
            }, () => {
                validateWeb3({
                    web3: getWeb3(),
                })
                    .then(() => {
                        if (!this.unmounted) {
                            this.setState({
                                checkingWeb3: false,
                            })
                        }
                    }, (error) => {
                        if (!this.unmounted) {
                            this.setState({
                                checkingWeb3: false,
                                web3Error: error,
                            })
                        }
                    })
            })
        }

        render() {
            const { checkingWeb3, web3Error } = this.state
            const { requireWeb3, onCancel, onClose } = this.props
            if (requireWeb3 && (checkingWeb3 || web3Error)) {
                return (
                    <Web3ErrorDialog
                        waiting={checkingWeb3}
                        onClose={onCancel || onClose}
                        error={web3Error}
                    />
                )
            }

            return (
                <WrappedComponent {...this.props} />
            )
        }
    }

    return WithWeb3
}

export default withWeb3
