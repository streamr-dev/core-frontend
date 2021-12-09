import { useState, useMemo, useCallback } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'

const { mainnet, sidechain } = getConfig()

const networks = {
    [mainnet.chainId]: {
        getParams: () => {
            throw new Error('Mainnet can not be added!')
        },
    },
    [sidechain.chainId]: {
        getParams: () => ({
            chainName: 'xDAI Chain',
            rpcUrls: ['https://rpc.xdaichain.com/'],
            blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
            nativeCurrency: {
                name: 'xDAI',
                symbol: 'xDAI',
                decimals: 18,
            },
        }),
    },
}

export default function useSwitchChain() {
    const [switchPending, setSwitchPending] = useState(false)
    const isMounted = useIsMounted()

    const switchChain = useCallback(async (nextChainId) => {
        const web3 = getWeb3()

        setSwitchPending(true)

        try {
            await validateWeb3({
                web3,
                requireNetwork: false,
            })

            if (!networks[nextChainId]) {
                throw new Error(`Chain id "${nextChainId}" is not supported!`)
            }

            // try switching networks
            await web3.currentProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{
                    chainId: web3.utils.toHex(nextChainId),
                }],
            })
        } catch (switchError) {
            const { getParams } = networks[nextChainId] || {}

            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902 && typeof getParams === 'function') {
                try {
                    // add the new network
                    await web3.currentProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: web3.utils.toHex(nextChainId),
                            ...getParams(),
                        }],
                    })
                } catch (addError) {
                    console.error(addError)
                }
            } else {
                console.error(switchError)
            }
        } finally {
            if (isMounted()) {
                setSwitchPending(false)
            }
        }
    }, [isMounted])

    return useMemo(() => ({
        switchChain,
        switchPending,
    }), [
        switchChain,
        switchPending,
    ])
}
