import { ConfirmationModalProps, confirmationModal } from '~/modals/ConfirmationModal'

export async function confirm(props: ConfirmationModalProps): Promise<boolean> {
    try {
        return await confirmationModal.pop(props)
    } catch (_) {}

    return false
}
