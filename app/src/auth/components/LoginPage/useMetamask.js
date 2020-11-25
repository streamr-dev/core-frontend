import { useMemo, useCallback } from 'react'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getSessionToken from '$auth/utils/getSessionToken'

const useMetamask = () => {
    const connect = useCallback(async () => {
        const web3 = getWeb3()

        await validateWeb3({
            web3,
            checkNetwork: false,
        })

        const token = await getSessionToken({
            provider: web3.metamaskProvider,
        })

        return token
    }, [])

    return useMemo(() => ({
        connect,
        enabled: true,
    }), [
        connect,
    ])
}

export default useMetamask
