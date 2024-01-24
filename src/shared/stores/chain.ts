import { produce } from 'immer'
import { create } from 'zustand'
import { availableChains, defaultChainConfig } from '~/getters/getChainConfig'
import { Chain } from '~/types'

interface Store {
    availableChains: Chain[]
    selectedChain: Chain
    setSelectedChain: (chainId: number) => void
}

export const useChainStore = create<Store>((set, get) => {
    return {
        availableChains,
        selectedChain: defaultChainConfig,

        setSelectedChain(chainId: number) {
            const nextChain = get().availableChains.find((c) => c.id === chainId)

            if (nextChain != null) {
                set((current) =>
                    produce(current, (next) => {
                        next.selectedChain = nextChain
                    }),
                )
            }
        },
    }
})

export function useCurrentChain() {
    return useChainStore((state) => state.selectedChain)
}

export function useCurrentChainId() {
    return useChainStore((state) => state.selectedChain.id)
}

export function useAvailableChains() {
    return useChainStore((state) => state.availableChains)
}
