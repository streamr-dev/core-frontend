// @flow

import * as React from 'react'

import AuthLayout from '../AuthLayout'
import UsernamePasswordLogin from '../../containers/UsernamePasswordLogin'
import EthereumLogin from '../../containers/EthereumLogin'
import { type Props as SessionProps } from '$auth/contexts/Session'

type Props = SessionProps & {}

type State = {
    useEthereum: boolean,
}

class LoginPage extends React.Component<Props, State> {
    state = {
        useEthereum: false,
    }

    switchToEthereum = () => {
        this.setState({
            useEthereum: true,
        })
    }

    switchToUsernamePassword = () => {
        this.setState({
            useEthereum: false,
        })
    }

    render() {
        const { useEthereum } = this.state

        return (
            <AuthLayout>
                {useEthereum ? (
                    <EthereumLogin {...this.props} onBackClick={this.switchToUsernamePassword} />
                ) : (
                    <UsernamePasswordLogin {...this.props} onEthereumClick={this.switchToEthereum} />
                )}
            </AuthLayout>
        )
    }
}

export default LoginPage
