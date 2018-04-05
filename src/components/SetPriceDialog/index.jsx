// @flow

import React from 'react'
import ModalDialog from '../ModalDialog'

type Props = {
    onClose: () => void,
}

const SetPriceDialog = ({ onClose }: Props) => (
    <ModalDialog onClose={onClose}>
        <h1>I am just a placeholder</h1>
        <button onClick={onClose}>Close</button>
    </ModalDialog>
)

export default SetPriceDialog
