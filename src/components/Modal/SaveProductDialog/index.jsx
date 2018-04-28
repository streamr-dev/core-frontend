// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onClose: () => void,
}

const SaveProductDialog = ({ onClose }: Props) => (
    <Dialog
        title="Save Product"
        onClose={onClose}
    >
        Saving product
    </Dialog>
)

export default SaveProductDialog
