import { Toaster, toaster } from 'toasterhea'
import { ConfirmationModal, ConfirmationModalProps } from '~/modals/ConfirmationModal'
import { Layer } from '~/utils/Layer'

let confirmationModal: Toaster<typeof ConfirmationModal> | undefined

export async function confirm(props: ConfirmationModalProps): Promise<boolean> {
    if (!confirmationModal) {
        confirmationModal = toaster(ConfirmationModal, Layer.Modal)
    }

    try {
        return await confirmationModal.pop(props)
    } catch (e) {}

    return false
}
