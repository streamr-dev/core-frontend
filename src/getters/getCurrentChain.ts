import { useChainStore } from '~/shared/stores/chain'

export function getCurrentChain() {
    return useChainStore.getState().selectedChain
}

export function getCurrentChainId() {
    return useChainStore.getState().selectedChain.id
}
