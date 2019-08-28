// @flow

import React from 'react'
import useModal from './useModal'

import ConfirmNoCoverImageDialog from '$mp/components/Modal/ConfirmNoCoverImageDialog'

export default () => {
    const { api, isOpen } = useModal('confirm')

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmNoCoverImageDialog
            onContinue={() => api.close(true)}
            closeOnContinue={false}
            onClose={() => api.close(false)}
        />
    )
}
