import EventEmitter from 'events'
import { SmartContractTransaction } from '~/shared/types/web3-types'
import { ProjectId, DataUnionId } from '~/marketplace/types/project-types'
import { checkEthereumNetworkIsCorrect } from '~/shared/utils/web3'
import TransactionError from '~/shared/errors/TransactionError'
import Transaction from '~/shared/utils/Transaction'
import { getDataUnion, getDataUnionClient } from '~/getters/du'
import { Secret } from './types'

export function deployDataUnion({
    productId,
    adminFee,
    chainId,
}: {
    productId: ProjectId
    adminFee: string
    chainId: number
}): SmartContractTransaction {
    const emitter = new EventEmitter()

    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }

    const tx = new Transaction(emitter)

    /**
     * The following does not go sequentially. Some calls
     * can be prevented by not using `.all`.
     */
    Promise.all([
        checkEthereumNetworkIsCorrect({
            network: chainId,
        }),
        getDataUnionClient(chainId),
    ])
        .then(([_, client]) => {
            return client.deployDataUnion({
                dataUnionName: productId,
                adminFee: +adminFee,
            })
        })
        .then((dataUnion) => {
            if (!dataUnion || !dataUnion.getAddress()) {
                errorHandler(new TransactionError('Transaction failed'))
            } else {
                emitter.emit('transactionHash', dataUnion.getAddress())
                emitter.emit('receipt', {
                    contractAddress: dataUnion.getAddress(),
                })
            }
        }, errorHandler)
        .catch(errorHandler)
    return tx
}

export async function createSecret({
    dataUnionId,
    name,
    chainId,
}: {
    dataUnionId: DataUnionId
    name: string
    chainId: number
}): Promise<Secret> {
    return (await getDataUnion(dataUnionId, chainId)).createSecret(name)
}

export async function editSecret({
    dataUnionId,
    id,
    name,
    chainId,
}: {
    dataUnionId: DataUnionId
    id: string
    name: string
    chainId: number
}): Promise<Secret> {
    const dataUnion = await getDataUnion(dataUnionId, chainId)

    /**
     * Looks like editing secrets isn't implemented on the client level. We do expose
     * a UI for editing secrets though. Let's keep things civil and at least check.
     * Failure is an option. It's fine as long as we know the (h)why.
     */
    if (!('editSecret' in dataUnion) || typeof dataUnion.editSecret !== 'function') {
        throw new Error('Editing secrets is not implemented')
    }

    return dataUnion.editSecret(id, name)
}

export async function deleteSecret({
    dataUnionId,
    id,
    chainId,
}: {
    dataUnionId: DataUnionId
    id: string
    chainId: number
}): Promise<Secret> {
    return (await getDataUnion(dataUnionId, chainId)).deleteSecret(id)
}
