// @flow

import React, { useState, useCallback } from 'react'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import SessionProvider from '../SessionProvider'
import AuthLayout from '../AuthLayout'
import UsernamePasswordLogin from '../UsernamePasswordLogin'
import EthereumLogin from '../EthereumLogin'

type Props = {}

const LoginPage = (props: Props) => {
    const [useEthereum, setUseEthereum] = useState(false)

    const switchToEthereum = useCallback(() => {
        setUseEthereum(true)
    }, [setUseEthereum])

    const switchToUsernamePassword = useCallback(() => {
        setUseEthereum(false)
    }, [setUseEthereum])

    return (
        <AuthLayout>
            {useEthereum ? (
                <EthereumLogin {...props} onBackClick={switchToUsernamePassword} />
            ) : (
                <UsernamePasswordLogin {...props} onEthereumClick={switchToEthereum} />
            )}
        </AuthLayout>
    )
}

export { LoginPage }

export default userIsNotAuthenticated((props: Props) => (
    <SessionProvider>
        <LoginPage {...props} />
    </SessionProvider>
))
