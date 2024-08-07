import { Contract, parseEther } from 'ethers'
import { ERC677, Operator, OperatorFactory } from 'network-contracts-ethers6'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { postImage } from '~/services/images'
import { getSigner } from '~/shared/stores/wallet'
import { Operation } from '~/shared/toasts/TransactionListToast'
import { toBN } from '~/utils/bn'
import { getContractAbi, getContractAddress } from '~/utils/contracts'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicProvider } from '~/utils/providers'
import { toastedOperation, toastedOperations } from '~/utils/toastedOperation'
import { call, CallableOptions } from '~/utils/tx'

export async function createOperator(
    chainId: number,
    params: {
        cut: number
        description: string
        imageToUpload?: File | undefined
        name: string
        redundancyFactor: number
    },
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    const { cut, name, redundancyFactor, description, imageToUpload } = params

    await networkPreflight(chainId)

    const signer = await getSigner()

    const walletAddress = await signer.getAddress()

    const imageIpfsCid = imageToUpload
        ? await postImage(chainId, imageToUpload)
        : undefined

    const factory = new Contract(
        getContractAddress('operatorFactory', chainId),
        getContractAbi('operatorFactory'),
        signer,
    ) as unknown as OperatorFactory

    const metadata = {
        name,
        description,
        redundancyFactor,
        imageIpfsCid,
    }

    const poolTokenName = `StreamrOperator-${walletAddress.slice(-5)}`

    const operatorMetadata = JSON.stringify(metadata)

    const policies: [string, string, string] = [
        getContractAddress('operatorDefaultDelegationPolicy', chainId),
        getContractAddress('operatorDefaultExchangeRatePolicy', chainId),
        getContractAddress('operatorDefaultUndelegationPolicy', chainId),
    ]

    const operatorsCutFraction = parseEther(cut.toString()) / 100n

    const policyParams: [number, number, number] = [0, 0, 0]

    await toastedOperation('Operator deployment', async () => {
        await call(factory, 'deployOperator', {
            args: [
                operatorsCutFraction,
                poolTokenName,
                operatorMetadata,
                policies,
                policyParams,
            ],
            onReceipt,
        })
    })
}

export async function updateOperator(
    chainId: number,
    operator: ParsedOperator,
    mods: {
        name: string
        redundancyFactor: number
        description: string
        imageToUpload?: File
        cut: number
    },
    { onReceipt }: CallableOptions = {},
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
        if (hasUpdateCutOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                getContractAbi('operator'),
                await getSigner(),
            ) as unknown as Operator

            await call(operatorContract, 'updateOperatorsCutFraction', {
                args: [parseEther(toBN(cut).toString()) / 100n],
                onReceipt: async (receipt) => {
                    blockNumbers.push(receipt.blockNumber)

                    if (!hasUpdateMetadataOperation) {
                        await onReceipt?.(receipt)
                    }
                },
            })

            next()
        }

        if (hasUpdateMetadataOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                getContractAbi('operator'),
                await getSigner(),
            ) as unknown as Operator

            const imageIpfsCid = imageToUpload
                ? await postImage(chainId, imageToUpload)
                : operator.metadata.imageIpfsCid

            await call(operatorContract, 'updateMetadata', {
                args: [
                    JSON.stringify({
                        name: name || undefined,
                        description: description || undefined,
                        redundancyFactor,
                        imageIpfsCid,
                    }),
                ],
                onReceipt: async (receipt) => {
                    blockNumbers.push(receipt.blockNumber)

                    await onReceipt?.(receipt)
                },
            })
        }
    })
}

export async function delegateToOperator(
    chainId: number,
    operatorId: string,
    amount: bigint,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        getContractAddress('data', chainId),
        getContractAbi('erc677'),
        signer,
    ) as unknown as ERC677

    await toastedOperation('Delegate to operator', async () => {
        await call(contract, 'transferAndCall', {
            args: [operatorId, amount, '0x'],
            onReceipt,
        })
    })
}

export async function undelegateFromOperator(
    chainId: number,
    operatorId: string,
    amount: bigint,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Undelegate from operator', async () => {
        await call(operatorContract, 'undelegate', {
            args: [amount],
            onReceipt,
        })
    })
}

export async function getOperatorDelegationAmount(
    chainId: number,
    operatorId: string,
    address: string,
) {
    const provider = await getPublicProvider(chainId)

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        provider,
    ) as unknown as Operator

    return operatorContract.balanceInData(address)
}

export async function setOperatorNodeAddresses(
    chainId: number,
    operatorId: string,
    addresses: string[],
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Save node addresses', async () => {
        await call(operatorContract, 'setNodeAddresses', {
            args: [addresses],
            onReceipt,
        })
    })
}

export async function addOperatorControllerAddress(
    chainId: number,
    operatorId: string,
    address: string,
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Authorise staking agent', async () => {
        await call(operatorContract, 'grantRole', {
            args: [await operatorContract.CONTROLLER_ROLE(), address],
            onReceipt,
        })
    })
}

export async function removeOperatorControllerAddress(
    chainId: number,
    operatorId: string,
    address: string,
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Revoke staking agent', async () => {
        await call(operatorContract, 'revokeRole', {
            args: [await operatorContract.CONTROLLER_ROLE(), address],
            onReceipt,
        })
    })
}

export async function processOperatorUndelegationQueue(
    chainId: number,
    operatorId: string,
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Process undelegation queue', async () => {
        await call(operatorContract, 'payOutQueue', {
            args: [0],
            onReceipt,
        })
    })
}
