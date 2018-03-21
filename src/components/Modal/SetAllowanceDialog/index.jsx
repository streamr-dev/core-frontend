// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onSet: () => void,
}

const SetAllowanceDialog = ({ onSet }: Props) => (
    <Dialog title="Set Marketplace Allowance" actions={{
        next: {
            title: 'Set',
            onClick: () => onSet()
        }
    }}>
        ...
    </Dialog>
)

export default SetAllowanceDialog
