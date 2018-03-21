// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onNext: () => void,
}

const ChooseAccessPeriod = ({ onNext }: Props) => (
    <Dialog title="Choose your access period" actions={{
        next: {
            title: 'Next',
            onClick: () => onNext()
        }
    }}>
        asd
    </Dialog>
)

export default ChooseAccessPeriod
