import React, { useMemo } from 'react'
import Provider from 'streamr-client-react'
import { getToken } from '$shared/utils/sessionToken'

export default function StreamrClientProvider({ children }) {
    const sessionToken = getToken()

    const auth = useMemo(() => (sessionToken == null ? {} : {
        sessionToken,
    }), [sessionToken])

    return (
        <Provider
            auth={auth}
            autoConnect
            autoDisconnect={false}
            restUrl={process.env.STREAMR_API_URL}
            url={process.env.STREAMR_WS_URL}
            verifySignatures="never"
        >
            {children}
        </Provider>
    )
}
