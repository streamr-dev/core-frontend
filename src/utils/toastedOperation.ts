import { toaster, Toaster } from 'toasterhea'
import uniqueId from 'lodash/uniqueId'
import TransactionListToast, {
    notify,
    Operation,
} from '~/shared/toasts/TransactionListToast'
import { Layer } from '~/utils/Layer'

export async function toastedOperation(label: string, fn?: () => void | Promise<void>) {
    await toastedOperations(
        [
            {
                id: uniqueId('operation-'),
                label: label,
            },
        ],
        () => fn?.(),
    )
}

export async function toastedOperations(
    operations: Operation[],
    fn?: (next: () => void, refresh: () => void) => void | Promise<void>,
) {
    let toast: Toaster<typeof TransactionListToast> | undefined = toaster(
        TransactionListToast,
        Layer.Toast,
    )

    if (!operations.length) {
        throw new Error('We toasting or hwhat?!')
    }

    operations.forEach((op) => {
        delete op.state
    })

    let pos = -1

    function refresh() {
        notify(toast, operations)
    }

    function next() {
        if (pos >= 0) {
            operations[pos].state = 'complete'
        }

        if (pos < operations.length - 1) {
            pos += 1

            operations[pos].state = 'ongoing'
        }

        refresh()
    }

    try {
        next()

        const result = await fn?.(next, refresh)

        next()

        return result
    } catch (e) {
        operations.forEach((op) => {
            if (op.state === 'ongoing') {
                op.state = 'error'
            }
        })

        refresh()

        throw e
    } finally {
        setTimeout(() => {
            toast?.discard()

            toast = undefined
        }, 3000)
    }
}
