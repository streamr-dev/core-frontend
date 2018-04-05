// @flow

import React from 'react'
import ModalDialog from '../ModalDialog'
import StepList from '../StepList'
import Step from '../StepList/Step'

type Props = {
    onClose: () => void,
}

const SetPriceDialog = ({ onClose }: Props) => (
    <ModalDialog onClose={onClose}>
        <StepList onCancel={onClose} onComplete={onClose}>
            <Step title="Set your product's price">
                Step 1
            </Step>
            <Step title="Set Ethereum addresses">
                Step 2
            </Step>
        </StepList>
    </ModalDialog>
)

export default SetPriceDialog
