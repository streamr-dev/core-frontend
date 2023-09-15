import { Contract } from 'ethers'
import { toaster, Toaster } from 'toasterhea'
import { isEqual, omit } from 'lodash'
import {
    operatorFactoryABI,
    operatorABI,
    OperatorFactory,
    Operator,
} from '@streamr/network-contracts'
import { parseEther } from 'ethers/lib/utils'
import { getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { Address } from '~/shared/types/web3-types'
import { getERC20TokenContract } from '~/getters'
import { BNish, toBN } from '~/utils/bn'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { toastedOperation } from '~/utils/toastedOperation'
import { postImage } from '~/services/images'
import { OperatorElement, OperatorMetadata } from '~/types/operator'
import TransactionListToast, {
    notify,
    Operation,
} from '~/shared/toasts/TransactionListToast'
import { Layer } from '~/utils/Layer'

const getOperatorChainId = () => {
    return defaultChainConfig.id
}

export async function createOperator(
    operatorCut: number,
    name: string,
    redundancyFactor: number,
    description?: string,
    imageToUpload?: File,
) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const walletAddress = await signer.getAddress()

    const imageIpfsCid = imageToUpload ? await postImage(imageToUpload) : undefined

    const factory = new Contract(
        chainConfig.contracts['OperatorFactory'],
        operatorFactoryABI,
        signer,
    ) as OperatorFactory

    const metadata = {
        name,
        description,
        redundancyFactor,
        imageIpfsCid,
    }

    const poolTokenName = `StreamrOperator-${walletAddress.slice(-5)}`
    const operatorMetadata = JSON.stringify(metadata)

    const policies: [Address, Address, Address] = [
        chainConfig.contracts.OperatorDefaultDelegationPolicy,
        chainConfig.contracts.OperatorDefaultPoolYieldPolicy,
        chainConfig.contracts.OperatorDefaultUndelegationPolicy,
    ]

    const operatorsCutFraction = parseEther(operatorCut.toString()).div(100)

    const policiesParams: [number, number, number] = [0, 0, 0]

    await toastedOperation('Operator deployment', async () => {
        const tx = await factory.deployOperator(
            operatorsCutFraction,
            poolTokenName,
            operatorMetadata,
            policies,
            policiesParams,
        )
        await tx.wait()
    })
}

export const updateOperator = async (
    currentOperatorObject: OperatorElement,
    name: string,
    redundancyFactor: number,
    description?: string,
    imageToUpload?: File,
    cut?: number,
): Promise<void> => {
    let toast: Toaster<typeof TransactionListToast> | undefined = toaster(
        TransactionListToast,
        Layer.Toast,
    )
    try {
        const chainId = getOperatorChainId()
        const signer = await getSigner()

        const operations: Operation[] = []

        const updateCutOperation: Operation = {
            id: 'updateCutOperation',
            label: "Update the operator's cut value",
            state: undefined,
        }

        const updateMetadataOperation: Operation = {
            id: 'updateMetadataOperation',
            label: "Update the operator's metadata",
            state: undefined,
        }

        const newOperatorMetadataWithoutImage: OperatorMetadata = {
            name,
            description,
            redundancyFactor,
        }

        const hasUpdateCutOperation =
            !currentOperatorObject.stakes.length &&
            cut &&
            !currentOperatorObject.operatorsCutFraction.isEqualTo(toBN(cut))

        const hasUpdateMetadataOperation =
            !isEqual(
                omit(currentOperatorObject.metadata, ['imageUrl', 'imageIpfsCid']),
                newOperatorMetadataWithoutImage,
            ) || !!imageToUpload

        // 1. Prepare the operations array

        if (hasUpdateCutOperation) {
            operations.push(updateCutOperation)
        }

        if (hasUpdateMetadataOperation) {
            operations.push(updateMetadataOperation)
        }

        // 2. Update cut
        if (hasUpdateCutOperation) {
            try {
                updateCutOperation.state = 'ongoing'
                notify(toast, operations)
                await networkPreflight(chainId)

                const operatorContract = new Contract(
                    currentOperatorObject.id,
                    operatorABI,
                    signer,
                ) as Operator
                const tx = await operatorContract.updateOperatorsCutFraction(
                    parseEther(cut.toString()).div(100),
                )
                await tx.wait()

                updateCutOperation.state = 'complete'
                notify(toast, operations)
            } catch (e) {
                if (updateCutOperation.state === 'ongoing') {
                    updateCutOperation.state = 'error'
                }
                notify(toast, operations)
                throw e
            }
        }

        // 3. Update metadata
        if (hasUpdateMetadataOperation) {
            try {
                updateMetadataOperation.state = 'ongoing'
                notify(toast, operations)
                await networkPreflight(chainId)

                const operatorContract = new Contract(
                    currentOperatorObject.id,
                    operatorABI,
                    signer,
                ) as Operator
                const imageIpfsCid = imageToUpload
                    ? await postImage(imageToUpload)
                    : currentOperatorObject.metadata?.imageIpfsCid
                const metadata = {
                    name: name || currentOperatorObject.metadata?.name,
                    description:
                        description || currentOperatorObject.metadata?.description,
                    redundancyFactor:
                        redundancyFactor ||
                        currentOperatorObject.metadata?.redundancyFactor,
                    imageIpfsCid,
                }
                const tx = await operatorContract.updateMetadata(JSON.stringify(metadata))
                await tx.wait()

                updateMetadataOperation.state = 'complete'
                notify(toast, operations)
            } catch (e) {
                if (updateMetadataOperation.state === 'ongoing') {
                    updateMetadataOperation.state = 'error'
                }
                notify(toast, operations)
                throw e
            }
        }
        if (!operations.length) {
            throw new Error('No operations')
        }
    } catch (e) {
        throw e
    } finally {
        setTimeout(() => {
            toast?.discard()
            toast = undefined
        }, 3000)
    }
}

export async function delegateToOperator(operatorId: string, amount: BNish) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tokenContract = getERC20TokenContract({
        tokenAddress: chainConfig.contracts['DATA'],
        provider: signer,
    })

    const tokenTx = await tokenContract.approve(operatorId, toBN(amount).toString())

    await tokenTx.wait()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    const operatorTx = await operatorContract.delegate(toBN(amount).toString())

    await operatorTx.wait()
}

export async function undelegateFromOperator(operatorId: string, amount: BNish) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tokenContract = getERC20TokenContract({
        tokenAddress: chainConfig.contracts['DATA'],
        provider: signer,
    })

    const tokenTx = await tokenContract.approve(operatorId, toBN(amount).toString())

    await tokenTx.wait()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    const operatorTx = await operatorContract.undelegate(toBN(amount).toString())

    await operatorTx.wait()
}

export async function getOperatorDelegationAmount(operatorId: string, address: string) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const provider = getPublicWeb3Provider(chainId)
    const operatorContract = new Contract(operatorId, operatorABI, provider) as Operator
    const amount = await operatorContract.balanceOf(address)
    return toBN(amount)
}

export async function addOperatorNodes(operatorId: string, addresses: string[]) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const provider = getPublicWeb3Provider(chainId)
    const operatorContract = new Contract(operatorId, operatorABI, provider) as Operator
    await operatorContract.updateNodeAddresses(addresses, [])
}

export async function removeOperatorNodes(operatorId: string, addresses: string[]) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const provider = getPublicWeb3Provider(chainId)
    const operatorContract = new Contract(operatorId, operatorABI, provider) as Operator
    await operatorContract.updateNodeAddresses([], addresses)
}
