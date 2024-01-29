import React, { useEffect, useState } from 'react'
import { StreamrClientConfig } from 'streamr-client'
import Provider from 'streamr-client-react'
import getClientConfig from '~/getters/getClientConfig'
import { getWalletProvider, useWalletAccount } from '../stores/wallet'
import { useCurrentChainId } from '../stores/chain'

export default function StreamrClientProvider({ children }) {
    const account = useWalletAccount()

    const chainId = useCurrentChainId()

    const [config, setConfig] = useState<StreamrClientConfig>(getClientConfig(chainId))

    useEffect(() => {
        const newConfig = getClientConfig(chainId)
        setConfig((current) => ({
            ...current,
            ...newConfig,
        }))
    }, [chainId])

    useEffect(() => {
        let mounted = true

        async function fn() {
            if (!account) {
                return
            }

            try {
                const provider = await getWalletProvider()

                if (!mounted) {
                    return
                }

                setConfig((current) => ({
                    ...current,
                    auth: {
                        ...(current.auth || {}),
                        ethereum: provider as any,
                    },
                }))
            } catch (e) {
                console.warn('Failed to update config', e)
            }
        }

        fn()

        return () => {
            mounted = false
        }
    }, [account])

    return <Provider {...config}>{children}</Provider>
}
