import { useMemo, useCallback } from 'react'

const useWalletConnect = () => {
    const connect = useCallback(async () => {
        throw new Error('not implemented')
    }, [])

    return useMemo(() => ({
        connect,
    }), [
        connect,
    ])
}

export default useWalletConnect
