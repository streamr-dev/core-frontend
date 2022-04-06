import getWeb3 from '$utils/web3/getWeb3'

export default async function getChainId() {
    const network = await getWeb3().eth.net.getId()
    return Number.isInteger(network) ? network : undefined
}
