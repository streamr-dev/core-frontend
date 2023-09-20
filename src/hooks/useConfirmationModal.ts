import { toaster } from 'toasterhea'
import { ConfirmationModal, ConfirmationModalProps } from '~/modals/ConfirmationModal'
import { Layer } from '~/utils/Layer'

export const useConfirmationModal = (): ((
    props: ConfirmationModalProps,
) => Promise<boolean>) => {
    const confirmationModal = toaster(ConfirmationModal, Layer.Modal)
    return async (props: ConfirmationModalProps) => {
        try {
            await confirmationModal.pop(props)
            return true
        } catch (e) {
            return false
        }
    }
}
