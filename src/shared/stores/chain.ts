import { produce } from 'immer'
import { create } from 'zustand'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { Chain } from '~/types'
import { getEnvironmentConfig } from '~/getters/getEnvironmentConfig'
import { getConfigForChain } from '../web3/config'

interface Store {
    selectedChain: Chain
    setSelectedChain: (chainId: number) => void
}

const SELECTED_CHAIN_LOCALSTORAGE_KEY = 'selectedChain.id'

const getSelectedChain = () => {
    const storageValue = localStorage.getItem(SELECTED_CHAIN_LOCALSTORAGE_KEY)
    if (storageValue != null) {
        try {
            return Number(storageValue)
        } catch (e) {
            console.warn('Could not parse selected chain id', e)
        }
    }

    return defaultChainConfig.id
}

const storeSelectedChain = (chainName: string) => {
    localStorage.setItem(SELECTED_CHAIN_LOCALSTORAGE_KEY, chainName)
}

export const useChainStore = create<Store>((set) => {
    const selectedChainConfig = getConfigForChain(getSelectedChain())

    const { availableChains } = getEnvironmentConfig()

    return {
        selectedChain: selectedChainConfig,

        setSelectedChain(chainId: number) {
            const nextChain = availableChains.find((c) => c.id === chainId)

            if (nextChain != null) {
                set((current) =>
                    produce(current, (next) => {
                        next.selectedChain = nextChain
                    }),
                )

                storeSelectedChain(nextChain.id.toString())
            }
        },
    }
})

export function useCurrentChain() {
    return useChainStore((state) => state.selectedChain)
}

export function useCurrentChainId() {
    return useCurrentChain().id
}
