export default async function getChainId({ eth }) {
    const network = await eth.net.getId()
    return Number.isInteger(network) ? network.toString() : undefined
}
