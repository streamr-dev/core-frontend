// @flow

import React from 'react'

import getWeb3, { validateWeb3 } from '$shared/web3/web3Provider'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'

import IdentityNameDialog from '../IdentityNameDialog'

type Props = {
    onClose: () => void,
    onSave: (string) => void,
}

const identityPhases = {
    NAME: 'name',
    CHALLENGE: 'challenge',
    COMPLETE: 'complete',
}

type State = {
    checkingWeb3: boolean,
    web3Error: ?Error,
    phase: $Values<typeof identityPhases>,
    name: string,
}

class AddIdentityDialog extends React.Component<Props, State> {
    state = {
        checkingWeb3: true,
        web3Error: null,
        phase: identityPhases.NAME,
        name: '',
    }

    componentDidMount() {
        validateWeb3(getWeb3())
            .then(() => {
                this.setState({
                    checkingWeb3: false,
                })
            }, (error) => {
                this.setState({
                    checkingWeb3: false,
                    web3Error: error,
                })
            })
    }

    onSetName = (name: string) => {
        this.setState({
            name,
            phase: identityPhases.CHALLENGE,
        })
        console.log(this.state.name)
    }

    render() {
        const { onClose } = this.props
        const { checkingWeb3, web3Error } = this.state

        if (checkingWeb3 || web3Error) {
            return (
                <Web3ErrorDialog
                    waiting={checkingWeb3}
                    onClose={onClose}
                    error={web3Error}
                />
            )
        }

        switch (this.state.phase) {
            case identityPhases.NAME:
                return (
                    <IdentityNameDialog
                        onClose={onClose}
                        onSave={this.onSetName}
                    />
                )

            default:
                return null
        }
    }
}

export default AddIdentityDialog
