import { Contract } from 'ethers'
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
import { BNish, toBN } from '~/utils/bn'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { toastedOperation, toastedOperations } from '~/utils/toastedOperation'
import { postImage } from '~/services/images'
import { Operation } from '~/shared/toasts/TransactionListToast'
import { ParsedOperator } from '~/parsers/OperatorParser'

const getOperatorChainId = () => {
    return defaultChainConfig.id
}

export async function createOperator(
    params: {
        cut: number
        description: string
        imageToUpload?: File | undefined
        name: string
        redundancyFactor: number
    },
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    const { cut, name, redundancyFactor, description, imageToUpload } = params

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

    const policies: [string, string, string] = [
        chainConfig.contracts.OperatorDefaultDelegationPolicy,
        chainConfig.contracts.OperatorDefaultExchangeRatePolicy,
        chainConfig.contracts.OperatorDefaultUndelegationPolicy,
    ]

    const operatorsCutFraction = parseEther(cut.toString()).div(100)

    const policiesParams: [number, number, number] = [0, 0, 0]

    await toastedOperation('Operator deployment', async () => {
        const tx = await factory.deployOperator(
            operatorsCutFraction,
            poolTokenName,
            operatorMetadata,
            policies,
            policiesParams,
        )
        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
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
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
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
            label: "Update the owner's cut value",
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

        if (hasUpdateCutOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                operatorABI,
                await getSigner(),
            ) as Operator

            const tx = await operatorContract.updateOperatorsCutFraction(
                parseEther(toBN(cut).toString()).div(100),
            )

            const { blockNumber } = await tx.wait()

            blockNumbers.push(blockNumber)

            if (!hasUpdateMetadataOperation) {
                await options.onBlockNumber?.(blockNumber)
            }

            next()
        }

        if (hasUpdateMetadataOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                operatorABI,
                await getSigner(),
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

            const { blockNumber } = await tx.wait()

            await options.onBlockNumber?.(blockNumber)

            blockNumbers.push(blockNumber)
        }
    })
}

export async function delegateToOperator(
    operatorId: string,
    amount: BNish,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
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

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
    })
}

export async function undelegateFromOperator(
    operatorId: string,
    amount: BNish,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
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

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
    })
}

export async function getOperatorDelegationAmount(operatorId: string, address: string) {
    const chainId = getOperatorChainId()
    const provider = getPublicWeb3Provider(chainId)
    const operatorContract = new Contract(operatorId, operatorABI, provider) as Operator
    const amount = await operatorContract.balanceOf(address)
    return toBN(amount)
}

export async function setOperatorNodeAddresses(
    operatorId: string,
    addresses: string[],
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const signer = await getSigner()
    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    await toastedOperation('Save node addresses', async () => {
        const tx = await operatorContract.setNodeAddresses(addresses)

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
    })
}
