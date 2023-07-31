import { toaster, Toaster } from 'toasterhea'
import uniqueId from 'lodash/uniqueId'
import TransactionListToast, {
    notify,
    Operation,
} from '~/shared/toasts/TransactionListToast'
import { Layer } from '~/utils/Layer'

export async function toastedOperation(label: string, fn?: () => Promise<void>) {
    let toast: Toaster<typeof TransactionListToast> | undefined = toaster(
        TransactionListToast,
        Layer.Toast,
    )

    const operation: Operation = {
        id: uniqueId('operation-'),
        label: label,
        state: 'ongoing',
    }

    const operations = [operation]

    try {
        notify(toast, operations)

        await fn?.()

        operation.state = 'complete'

        notify(toast, operations)
    } catch (e) {
        operations.forEach((op) => {
            if (op.state === 'ongoing') {
                op.state = 'error'
            }
        })

        notify(toast, operations)

        throw e
    } finally {
        setTimeout(() => {
            toast?.discard()

            toast = undefined
        }, 3000)
    }
}
