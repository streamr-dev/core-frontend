import React, {useContext, useMemo} from 'react'
import Provider from 'streamr-client-react'
import getClientConfig from '$app/src/getters/getClientConfig'
import getWeb3 from '$utils/web3/getWeb3'
import {AuthenticationControllerContext} from "$auth/authenticationController"

export default function StreamrClientProvider({ children }) {
    const {currentAuthSession} = useContext(AuthenticationControllerContext)
    const token = currentAuthSession.address
    const config = useMemo(() => {
        const nextConfig = getClientConfig()

        if (token) {
            nextConfig.auth = {
                ...nextConfig.auth,
                ethereum: getWeb3().currentProvider,
            }
        }

        return nextConfig
    }, [token])
    return <Provider {...config}>{children}</Provider>
}
