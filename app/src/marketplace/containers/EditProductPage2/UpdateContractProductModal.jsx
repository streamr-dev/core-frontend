// @flow

import React from 'react'
import useModal from './useModal'

import { transactionStates } from '$shared/utils/constants'

import SaveProductDialogComponent from '$mp/components/Modal/SaveProductDialog'

export default () => {
    const { api, isOpen } = useModal('updateContract')

    if (!isOpen) {
        return null
    }

    return (
        <SaveProductDialogComponent
            transactionState={transactionStates.STARTED}
            onClose={() => api.close(false)}
        />
    )
}
