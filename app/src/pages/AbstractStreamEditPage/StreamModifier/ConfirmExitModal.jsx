import React from 'react'
import useModal from '$shared/hooks/useModal'
import ConfirmDialog from '$shared/components/ConfirmDialog'

export default function ConfirmExitModal() {
    const { api, isOpen } = useModal('confirmExit')

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmDialog
            title="You have unsaved changes"
            message="You have made changes to this stream. Do you still want to exit?"
            onAccept={() => api.close({
                canProceed: true,
            })}
            onReject={() => api.close({
                canProceed: false,
            })}
        />
    )
}
