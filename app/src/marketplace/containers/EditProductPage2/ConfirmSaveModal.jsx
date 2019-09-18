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
            onSave={() => api.close({
                save: true,
                redirect: true,
            })}
            onContinue={() => api.close({
                save: false,
                redirect: true,
            })}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
        />
    )
}
