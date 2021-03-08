import { useCallback } from 'react'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getSessionToken from '$auth/utils/getSessionToken'

const useMetamask = () => (
    useCallback(async () => {
        const web3 = getWeb3()

        await validateWeb3({
            web3,
            checkNetwork: false,
        })

        const token = await getSessionToken({
            ethereum: web3.metamaskProvider,
        })

        return token
    }, [])
)

export default useMetamask
