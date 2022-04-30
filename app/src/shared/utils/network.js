import validateWeb3 from '$utils/web3/validateWeb3'
import getConfig from '$shared/web3/config'
import UnsupportedNetworkError from '$shared/errors/UnsupportedNetworkError'
import MissingNetworkParamsError from '$shared/errors/MissingNetworkParamsError'
import MissingNetworkError from '$shared/errors/MissingNetworkError'
import getWeb3 from '$utils/web3/getWeb3'

export async function switchNetwork(nextChainId) {
    const web3 = getWeb3()

    const { metamask: networks } = getConfig()

    await validateWeb3({
        requireNetwork: false,
    })

    if (!networks[nextChainId]) {
        throw new UnsupportedNetworkError(nextChainId)
    }

    try {
        await web3.currentProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{
                chainId: web3.utils.toHex(nextChainId),
            }],
        })
    } catch (e) {
        if (e.code === 4902) {
            // This error code indicates that the chain has not been added to MetaMask.
            throw new MissingNetworkError(nextChainId)
        }

        throw e
    }
}

export async function addNetwork(nextChainId) {
    const web3 = getWeb3()

    const { metamask: networks } = getConfig()

    const { getParams = () => void 0 } = networks[nextChainId] || {}

    const params = getParams()

    if (!params) {
        throw new MissingNetworkParamsError(nextChainId)
    }

    await web3.currentProvider.request({
        method: 'wallet_addEthereumChain',
        params: [{
            chainId: web3.utils.toHex(nextChainId),
            ...getParams(),
        }],
    })
}
