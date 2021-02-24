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
                proceed: true,
            })}
            onContinue={() => api.close({
                save: false,
                proceed: true,
            })}
            onClose={() => api.close({
                save: false,
                proceed: false,
            })}
        >
            <p>
                You have made changes to this stream.
                <br />
                Do you want to save your changes?
            </p>
        </ConfirmSaveDialog>
    )
}
