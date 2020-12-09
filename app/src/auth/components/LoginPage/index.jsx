// @flow

import React, { useState, useCallback } from 'react'
import qs from 'query-string'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import SessionProvider from '../SessionProvider'
import AuthLayout from '../AuthLayout'
import UsernamePasswordLogin from '../UsernamePasswordLogin'
import EthereumLogin from '../EthereumLogin'

type LoginPageProps = {
    preferEthereum: boolean,
}

const LoginPage = ({ preferEthereum, ...props }: LoginPageProps) => {
    const [useEthereum, setUseEthereum] = useState(preferEthereum)

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

type Props = {
    useEthereum?: string,
    location: {
        search: string,
    },
}

export default userIsNotAuthenticated((props: Props) => {
    const useEthereum = !!qs.parse(props.location.search).metamask

    return (
        <SessionProvider>
            <LoginPage {...props} preferEthereum={useEthereum} />
        </SessionProvider>
    )
})
