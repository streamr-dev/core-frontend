import React from 'react'
import Provider from 'streamr-client-react'
import getClientConfig from '$shared/utils/getClientConfig'

export default function StreamrClientProvider({ children }) {
    const config = getClientConfig()

    return (
        <Provider {...config}>
            {children}
        </Provider>
    )
}
