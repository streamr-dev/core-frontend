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
import { BNish, toBN } from '~/utils/bn'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { toastedOperation, toastedOperations } from '~/utils/toastedOperation'
import { postImage } from '~/services/images'
import { OperatorElement, OperatorMetadata } from '~/types/operator'
import TransactionListToast, {
    notify,
    Operation,
} from '~/shared/toasts/TransactionListToast'
import { Layer } from '~/utils/Layer'
import { saveLastBlockNumber } from '~/getters/waitForGraphSync'
import { ParsedOperator } from '~/parsers/OperatorParser'

const getOperatorChainId = () => {
    return defaultChainConfig.id
}

export async function createOperator(
    operatorCut: number,
    name: string,
    redundancyFactor: number,
    description?: string,
    imageToUpload?: File,
): Promise<void> {
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
        chainConfig.contracts.OperatorDefaultExchangeRatePolicy,
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
        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}

export async function updateOperator(
    operator: ParsedOperator,
    mods: {
        name: string
        redundancyFactor: number
        description: string
        imageToUpload?: File
        cut: number
    },
) {
    const { name, redundancyFactor, description = '', imageToUpload, cut } = mods

    const { metadata } = operator

    const operations: Operation[] = []

    const hasUpdateCutOperation = !operator.stakes.length && operator.operatorsCut !== cut

    const hasUpdateMetadataOperation =
        !!imageToUpload ||
        name !== metadata.name ||
        description !== metadata.description ||
        redundancyFactor !== metadata.redundancyFactor

    if (hasUpdateCutOperation) {
        operations.push({
            id: 'updateCutOperation',
            label: "Update the operator's cut value",
        })
    }

    if (hasUpdateMetadataOperation) {
        operations.push({
            id: 'updateMetadataOperation',
            label: "Update the operator's metadata",
        })
    }

    if (!operations.length) {
        return
    }

    const blockNumbers: number[] = []

    await toastedOperations(operations, async (next) => {
        const chainId = getOperatorChainId()

        const signer = await getSigner()

        if (hasUpdateCutOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                operatorABI,
                signer,
            ) as Operator

            const tx = await operatorContract.updateOperatorsCutFraction(
                parseEther(toBN(cut).toString()).div(100),
            )

            const receipt = await tx.wait()

            blockNumbers.push(receipt.blockNumber)

            next()
        }

        if (hasUpdateMetadataOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                operatorABI,
                signer,
            ) as Operator

            const imageIpfsCid = imageToUpload
                ? await postImage(imageToUpload)
                : operator.metadata.imageIpfsCid

            const tx = await operatorContract.updateMetadata(
                JSON.stringify({
                    name: name || undefined,
                    description: description || undefined,
                    redundancyFactor,
                    imageIpfsCid,
                }),
            )

            const receipt = await tx.wait()

            blockNumbers.push(receipt.blockNumber)
        }
    })

    const blockNumber = blockNumbers.pop()

    if (typeof blockNumber !== 'undefined') {
        saveLastBlockNumber(blockNumber)
    }
}

export async function delegateToOperator(
    operatorId: string,
    amount: BNish,
): Promise<void> {
    const chainId = getOperatorChainId()
    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(chainConfig.contracts.DATA, ERC677ABI, signer) as ERC677

    await toastedOperation('Delegate to operator', async () => {
        const tx = await contract.transferAndCall(
            operatorId,
            toBN(amount).toString(),
            '0x',
        )

        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}

export async function undelegateFromOperator(
    operatorId: string,
    amount: BNish,
): Promise<void> {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    // If we are requesting all funds to be undelegated,
    // send 'reallyBigNumber' instead of 'Infinity'
    const amountBn = toBN(amount)
    const reallyBigNumber = '110763745230805656649802800132303954225'
    const actualAmount = amountBn.isFinite() ? amountBn : toBN(reallyBigNumber)

    await toastedOperation('Undelegate from operator', async () => {
        const tx = await operatorContract.undelegate(actualAmount.toString())

        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}

export async function getOperatorDelegationAmount(operatorId: string, address: string) {
    const chainId = getOperatorChainId()
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
