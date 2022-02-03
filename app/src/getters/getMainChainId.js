import getConfig from '$app/src/getters/getConfig'

export default function getMainChainId() {
    return getConfig().client?.mainchain?.chainId
}
