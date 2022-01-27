import React, { useMemo } from 'react'
import Provider from 'streamr-client-react'
import getStreamrClientConfig from '$app/src/getters/getStreamrClientConfig'
import { useSession } from '$auth/components/SessionProvider'

export default function StreamrClientProvider({ children }) {
    const { token } = useSession()

    const config = useMemo(() => {
        const nextConfig = getStreamrClientConfig()

        if (token) {
            nextConfig.auth = {
                ...nextConfig.auth,
                sessionToken: token,
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
