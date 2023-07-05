import BigNumber from 'bignumber.js'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { AbiItem } from 'web3-utils'
import Web3 from 'web3'
import { getConfigForChain } from '~/shared/web3/config'
import projectRegistryAbi from '~/shared/web3/abis/projectRegistry.json'
import { call } from '~/marketplace/utils/smartContract'
import {
    getMarketplaceAbiAndAddress,
    getMarketplaceAddress,
} from '~/marketplace/utils/web3'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import getPublicWeb3 from '~/utils/web3/getPublicWeb3'
import { ProjectType } from '~/shared/types'
import tokenAbi from '~/shared/web3/abis/token.json'
import address0 from '~/utils/address0'
import getCoreConfig from './getCoreConfig'

export function getGraphUrl() {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()

    return `${theGraphUrl}/subgraphs/name/${theHubGraphName}`
}

export function getProjectRegistryContract({
    chainId,
    web3,
}: {
    chainId: number
    web3: Web3
}) {
    const { contracts } = getConfigForChain(chainId)

    const contractAddress = contracts.ProjectRegistryV1 || contracts.ProjectRegistry

    if (!contractAddress) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    return new web3.eth.Contract(projectRegistryAbi as AbiItem[], contractAddress)
}

export function getERC20TokenContract({
    tokenAddress,
    web3,
}: {
    tokenAddress: string
    web3: Web3
}) {
    return new web3.eth.Contract(tokenAbi as AbiItem[], tokenAddress)
}

export function getMarketplaceContract({
    chainId,
    web3,
}: {
    chainId: number
    web3: Web3
}) {
    const { abi, address } = getMarketplaceAbiAndAddress(chainId)

    return new web3.eth.Contract(abi, address)
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
                    getERC20TokenContract({
                        tokenAddress,
                        web3: getPublicWeb3(chainId),
                    }).methods.allowance(account, getMarketplaceAddress(chainId)),
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
    if (account === address0) {
        return {
            canBuy: false,
            canDelete: false,
            canEdit: false,
            canGrant: false,
        }
    }

    const response = await getProjectRegistryContract({
        chainId,
        web3: getPublicWeb3(chainId),
    })
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
