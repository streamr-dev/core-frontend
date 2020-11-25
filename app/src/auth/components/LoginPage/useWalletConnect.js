import { useMemo, useCallback } from 'react'

const useWalletConnect = () => {
    const connect = useCallback(async () => {
        throw new Error('not implemented')
    }, [])

    return useMemo(() => ({
        connect,
        enabled: false,
    }), [
        connect,
    ])
}

export default useWalletConnect
