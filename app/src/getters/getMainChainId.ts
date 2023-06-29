import { defaultChainConfig } from '$app/src/getters/getChainConfig'
export default function getMainChainId() {
    return defaultChainConfig.id
}
