import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { getConfigForChain } from '$shared/web3/config'
import projectRegistryAbi from '$shared/web3/abis/projectRegistry.json'
import { call } from '$mp/utils/smartContract'
import { erc20TokenContractMethods } from '$mp/utils/web3'
import { marketplaceContract } from '$app/src/services/marketplace'
import Toast, { ToastType } from '$shared/toasts/Toast'
import { Layer } from '$utils/Layer'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import { ProjectType } from '$shared/types'
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

export async function getAllowance(
    chainId: number,
    tokenAddress: string,
    account: string,
    { recover = false }: { recover?: boolean } = {},
) {
    while (true) {
        try {
            return new BigNumber(
                await call(
                    erc20TokenContractMethods(tokenAddress, true, chainId).allowance(
                        account,
                        marketplaceContract(true, chainId).options.address,
                    ),
                ),
            )
        } catch (e) {
            console.warn('Allowance check failed', e)

            if (!recover) {
                throw e
            }

            try {
                await toaster(Toast, Layer.Toast).pop({
                    title: 'Allowance check failed',
                    type: ToastType.Warning,
                    desc: 'Would you like to try again?',
                    okLabel: 'Yes',
                    cancelLabel: 'No',
                })

                continue
            } catch (_) {
                throw e
            }
        }
    }
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
