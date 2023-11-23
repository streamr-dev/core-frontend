import EventEmitter from 'events'
import Transaction from '~/shared/utils/Transaction'
import { getDataUnion, getDataUnionClient } from '~/getters/du'
import networkPreflight from '~/utils/networkPreflight'
import { Secret } from './types'

export function deployDataUnion({
    productId,
    adminFee,
    chainId,
}: {
    productId: string
    adminFee: number
    chainId: number
}): Transaction {
    const emitter = new EventEmitter()

    const errorHandler = (error: unknown) => {
        emitter.emit('error', error)
    }

    const tx = new Transaction(emitter)

    void (async () => {
        try {
            await networkPreflight(chainId)

            const client = await getDataUnionClient(chainId)

            const dataUnion = await client.deployDataUnion({
                dataUnionName: productId,
                adminFee,
            })

            const duAddress = dataUnion.getAddress()

            emitter.emit('transactionHash', duAddress)

            emitter.emit('receipt', {
                contractAddress: duAddress,
            })
        } catch (e) {
            errorHandler(e)
        }
    })()

    return tx
}

export async function createSecret({
    dataUnionId,
    name,
    chainId,
}: {
    dataUnionId: string
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
    dataUnionId: string
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
    dataUnionId: string
    id: string
    chainId: number
}): Promise<Secret> {
    return (await getDataUnion(dataUnionId, chainId)).deleteSecret(id)
}
