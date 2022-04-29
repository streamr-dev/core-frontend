import React, { useMemo } from 'react'
import Provider from 'streamr-client-react'
import getClientConfig from '$app/src/getters/getClientConfig'
import { useSessionToken } from '$shared/reducers/session'
import getWeb3 from '$utils/web3/getWeb3'

export default function StreamrClientProvider({ children }) {
    const token = useSessionToken()

    const config = useMemo(() => {
        const nextConfig = getClientConfig()

        const web3 = getWeb3()

        if (token) {
            nextConfig.auth = {
                ...nextConfig.auth,
                sessionToken: token || undefined,
                ethereum: web3 && web3.metamaskProvider,
            }
        }

        return nextConfig
    }, [token])

    return (
        <Provider {...config}>
            {children}
        </Provider>
    )
}
