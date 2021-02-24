// @flow

import React from 'react'

import useModal from '$shared/hooks/useModal'

import ConfirmSaveDialog from '$shared/components/ConfirmSaveDialog'

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
        >
            <p>
                You have made changes to this product.
                <br />
                Do you want to save your changes?
            </p>
        </ConfirmSaveDialog>
    )
}
