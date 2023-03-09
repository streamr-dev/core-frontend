import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    visible: boolean,
    onConfirm: () => void,
}

const Complete = ({ visible, onConfirm }: Props) => {
    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Success!</DialogTitle>
            <div>test</div>
            <NextButton
                onClick={() => onConfirm()}
            >
                Done
            </NextButton>
        </DialogContainer>
    )
}

export default Complete
