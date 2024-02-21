import EventEmitter from 'events'
import { getDataUnionClient } from '~/getters/du'
import Transaction from '~/shared/utils/Transaction'
import networkPreflight from '~/utils/networkPreflight'

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
