import { useState, useMemo, useCallback } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'

const { mainnet, sidechain } = getConfig()

const networks = {
    // local development values
    // Note: rpcUrls need to use HTTPS urls, otherwise adding the chain will fail
    [mainnet.chainId]: {
        getParams: () => ({
            chainName: 'Mainchain (dev)',
            rpcUrls: [mainnet.rpcUrl],
            nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
            },
        }),
    },
    [sidechain.chainId]: {
        getParams: () => ({
            chainName: 'Sidechain (dev)',
            rpcUrls: [sidechain.rpcUrl],
            nativeCurrency: {
                name: 'xDAI',
                symbol: 'xDAI',
                decimals: 18,
            },
        }),
    },
    // Real chain values
    // Note: urls are added to user's Metamask, do not use private RPC urls here
    '1': {
        getParams: () => {
            throw new Error('Mainnet can not be added!')
        },
    },
    '100': {
        getParams: () => ({
            chainName: 'xDAI',
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
