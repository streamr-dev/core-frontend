import React, { useMemo } from 'react'
import Provider from 'streamr-client-react'
import getClientConfig from '$shared/utils/getClientConfig'
import { useSession } from '$auth/components/SessionProvider'

export default function StreamrClientProvider({ children }) {
    const { token } = useSession()

    const config = useMemo(() => {
        const nextConfig = getClientConfig()

        if (token) {
            nextConfig.auth = {
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
