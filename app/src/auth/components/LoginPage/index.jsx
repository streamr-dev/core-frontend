// @flow

import * as React from 'react'

import AuthLayout from '../AuthLayout'
import UsernamePasswordLogin from '../UsernamePasswordLogin'
import EthereumLogin from '../EthereumLogin'
import { type Props as SessionProps } from '$auth/contexts/Session'
import { type AuthFlowProps } from '$shared/flowtype/auth-types'

type Props = SessionProps & AuthFlowProps & {
    form: {
        email: string,
        password: string,
        rememberMe: boolean,
    },
}

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
                    <EthereumLogin {...this.props} prev={this.switchToUsernamePassword} />
                ) : (
                    <UsernamePasswordLogin {...this.props} onEthereumClick={this.switchToEthereum} />
                )}
            </AuthLayout>
        )
    }
}

export default LoginPage
