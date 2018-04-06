// @flow

import React from 'react'
import ModalDialog from '../ModalDialog'
import Steps from '../Steps'
import Step from '../Steps/Step'

type Props = {
    onClose: () => void,
}

const SetPriceDialog = ({ onClose }: Props) => (
    <ModalDialog onClose={onClose}>
        <Steps onCancel={onClose} onComplete={onClose}>
            <Step title="Set your product's price">
                Step 1
            </Step>
            <Step title="Set Ethereum addresses">
                Step 2
            </Step>
        </Steps>
    </ModalDialog>
)

export default SetPriceDialog
