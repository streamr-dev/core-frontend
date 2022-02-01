import config from '$config'

export default function getMainChainId() {
    return config.client?.mainchain?.chainId
}
