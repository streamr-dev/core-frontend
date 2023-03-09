import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Dialog from '$shared/components/Dialog'
import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    onClose?: () => void,
    onConfirm: () => void,
}

const Purchase = ({ onClose, onConfirm }: Props) => {
    return (
        <Dialog
            title="Confirm purchase"
            onClose={onClose}
            actions={{
                pay: {
                    title: 'Add',
                    kind: 'primary',
                    spinner: true,
                    onClick: () => console.log('ok'),
                },
            }}
            useDarkBackdrop
            closeOnEsc={false}
            closeOnBackdropClick={false}
        >
            Buy
        </Dialog>
    )
}

export default Purchase
