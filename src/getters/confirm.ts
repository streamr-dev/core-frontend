import { toaster } from 'toasterhea'
import { ConfirmationModal, ConfirmationModalProps } from '~/modals/ConfirmationModal'
import { Layer } from '~/utils/Layer'

export async function confirm(props: ConfirmationModalProps): Promise<boolean> {
    try {
        await toaster(ConfirmationModal, Layer.Modal).pop(props)
        return true
    } catch (e) {
        return false
    }
}
