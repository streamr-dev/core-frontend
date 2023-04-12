import React, { useMemo } from 'react'
import { ExternalProvider } from 'streamr-client'
import Provider from 'streamr-client-react'
import getClientConfig from '$app/src/getters/getClientConfig'
import getWeb3 from '$utils/web3/getWeb3'
import { useAuthController } from '$auth/hooks/useAuthController'

export default function StreamrClientProvider({ children }) {
    const token = useAuthController().currentAuthSession.address

    const config = useMemo(() => {
        const nextConfig = getClientConfig()

        if (token) {
            nextConfig.auth = {
                ...nextConfig.auth,
                ethereum: getWeb3().currentProvider as ExternalProvider,
            }
        }

        return nextConfig
    }, [token])
    return <Provider {...config}>{children}</Provider>
}
