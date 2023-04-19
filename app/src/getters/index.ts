import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { getConfigForChain } from '$shared/web3/config'
import projectRegistryAbi from '$shared/web3/abis/projectRegistry.json'
import getCoreConfig from './getCoreConfig'

export function getGraphUrl() {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()

    return `${theGraphUrl}/subgraphs/name/${theHubGraphName}`
}

export function getProjectRegistryContract(chainId: number, web3: Web3) {
    const { contracts } = getConfigForChain(chainId)

    const contractAddress = contracts.ProjectRegistryV1 || contracts.ProjectRegistry

    if (!contractAddress) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    return new web3.eth.Contract(projectRegistryAbi as AbiItem[], contractAddress)
}
