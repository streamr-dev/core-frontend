import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { z } from 'zod'
import { getConfigForChain } from '$shared/web3/config'
import projectRegistryAbi from '$shared/web3/abis/projectRegistry.json'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import { ProjectType, Project } from '$shared/types'
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

export async function getProjectPermissions(
    chainId: number,
    projectId: string,
    account: string,
) {
    const response = await getProjectRegistryContract(chainId, getPublicWeb3(chainId))
        .methods.getPermission(projectId, account)
        .call()

    const [canBuy = false, canDelete = false, canEdit = false, canGrant = false] = z
        .array(z.boolean())
        .parse(response)

    return {
        canBuy,
        canDelete,
        canEdit,
        canGrant,
    }
}

export function getProjectTypeName(projectType: ProjectType) {
    switch (projectType) {
        case ProjectType.DataUnion:
            return 'Data Union'
        case ProjectType.OpenData:
            return 'open data project'
        case ProjectType.PaidData:
            return 'paid data project'
    }
}

export function getProjectTypeTitle(projectType: ProjectType) {
    switch (projectType) {
        case ProjectType.DataUnion:
            return 'Data Union'
        case ProjectType.OpenData:
            return 'Open Data'
        case ProjectType.PaidData:
            return 'Paid Data'
    }
}

export function getProjectImageUrl({
    imageUrl,
    imageIpfsCid,
}: {
    imageUrl?: string
    imageIpfsCid?: string
}) {
    const {
        ipfs: { ipfsGatewayUrl },
    } = getCoreConfig()

    if (imageIpfsCid) {
        return `${ipfsGatewayUrl}${imageIpfsCid}`
    }

    if (!imageUrl) {
        return
    }

    return `${imageUrl.replace(/^https:\/\/ipfs\.io\/ipfs\//, ipfsGatewayUrl)}`
}
