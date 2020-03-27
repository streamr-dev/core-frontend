// @flow

import React, { useState, useCallback, useMemo } from 'react'
import qs from 'query-string'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import SessionProvider from '../SessionProvider'
import AuthLayout from '../AuthLayout'
import UsernamePasswordLogin from '../UsernamePasswordLogin'
import EthereumLogin from '../EthereumLogin'

type Props = {
    location: {
        search: string,
    },
}

const LoginPage = (props: Props) => {
    const { search } = props.location
    const hasEthLogin = useMemo(() => qs.parse(search).ethLogin || '', [search])

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
                <UsernamePasswordLogin {...props} onEthereumClick={hasEthLogin && switchToEthereum} />
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
