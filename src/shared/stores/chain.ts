import { produce } from 'immer'
import { create } from 'zustand'
import { availableChains, defaultChainConfig } from '~/getters/getChainConfig'
import { Chain } from '~/types'
import { getConfigForChain } from '../web3/config'

interface Store {
    availableChains: Chain[]
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

export const useChainStore = create<Store>((set, get) => {
    const selectedChainConfig = getConfigForChain(getSelectedChain())
    return {
        availableChains,
        selectedChain: selectedChainConfig,

        setSelectedChain(chainId: number) {
            const nextChain = get().availableChains.find((c) => c.id === chainId)

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

export function useAvailableChains() {
    return useChainStore((state) => state.availableChains)
}
