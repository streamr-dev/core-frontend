import React, { useEffect, useState } from 'react'
import { StreamrClientConfig } from 'streamr-client'
import Provider from 'streamr-client-react'
import getClientConfig from '~/getters/getClientConfig'
import { getWalletProvider, useWalletAccount } from '../stores/wallet'

export default function StreamrClientProvider({ children }) {
    const account = useWalletAccount()

    const [config, setConfig] = useState<StreamrClientConfig>(getClientConfig())

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

    return (
        <Provider {...config} cacheKey={account}>
            {children}
        </Provider>
    )
}
