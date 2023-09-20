import { Contract } from 'ethers'
import { toaster, Toaster } from 'toasterhea'
import { isEqual, omit } from 'lodash'
import {
    operatorFactoryABI,
    operatorABI,
    OperatorFactory,
    Operator,
    ERC677ABI,
    ERC677,
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
): Promise<number> {
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

    return await toastedOperation('Operator deployment', async () => {
        const tx = await factory.deployOperator(
            operatorsCutFraction,
            poolTokenName,
            operatorMetadata,
            policies,
            policiesParams,
        )
        const receipt = await tx.wait()
        return receipt.blockNumber
    })
}

export const updateOperator = async (
    currentOperatorObject: OperatorElement,
    name: string,
    redundancyFactor: number,
    description?: string,
    imageToUpload?: File,
    cut?: number,
): Promise<number> => {
    let toast: Toaster<typeof TransactionListToast> | undefined = toaster(
        TransactionListToast,
        Layer.Toast,
    )
    try {
        const chainId = getOperatorChainId()
        const signer = await getSigner()

        const operations: Operation[] = []
        const blockNumbers: number[] = []

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
                const receipt = await tx.wait()

                updateCutOperation.state = 'complete'
                notify(toast, operations)
                blockNumbers.push(receipt.blockNumber)
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
                const receipt = await tx.wait()

                updateMetadataOperation.state = 'complete'
                notify(toast, operations)
                blockNumbers.push(receipt.blockNumber)
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
        } else {
            return blockNumbers.pop() as number
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

export async function delegateToOperator(
    operatorId: string,
    amount: BNish,
): Promise<number> {
    const chainId = getOperatorChainId()
    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(chainConfig.contracts.DATA, ERC677ABI, signer) as ERC677

    return await toastedOperation('Delegate to operator', async () => {
        const tx = await contract.transferAndCall(
            operatorId,
            toBN(amount).toString(),
            '0x',
        )

        const receipt = await tx.wait()
        return receipt.blockNumber
    })
}

export async function undelegateFromOperator(
    operatorId: string,
    amount: BNish,
): Promise<number> {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    return await toastedOperation('Undelegate from operator', async () => {
        const tx = await operatorContract.undelegate(toBN(amount).toString())

        const receipt = await tx.wait()
        return receipt.blockNumber
    })
}

export async function getOperatorDelegationAmount(operatorId: string, address: string) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const provider = getPublicWeb3Provider(chainId)
    const operatorContract = new Contract(operatorId, operatorABI, provider) as Operator
    const amount = await operatorContract.balanceOf(address)
    return toBN(amount)
}

export async function setOperatorNodeAddresses(operatorId: string, addresses: string[]) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const signer = await getSigner()
    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    await toastedOperation('Save node addresses', async () => {
        const tx = await operatorContract.setNodeAddresses(addresses)
        await tx.wait()
    })
}
