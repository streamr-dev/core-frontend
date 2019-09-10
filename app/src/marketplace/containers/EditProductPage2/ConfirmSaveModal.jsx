// @flow

import React from 'react'
import useModal from '$shared/hooks/useModal'

import ConfirmSaveDialog from '$mp/components/Modal/ConfirmSaveDialog'

export default () => {
    const { api, isOpen } = useModal('confirmSave')

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmSaveDialog
            onContinue={() => api.close(true)}
            onClose={() => api.close(false)}
        />
    )
}
