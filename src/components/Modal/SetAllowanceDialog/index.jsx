// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    waiting: boolean,
    onSet: () => void,
}

const HelpText = () => (
    <div>
        <p>Allowance is a requirement of ERC-20 token transfers, designed to increase security and efficiency.</p>
        <p>For more about allowances, see this <a href="#">page</a>.</p>
    </div>
)

const SetAllowanceDialog = ({ waiting, onSet }: Props) => (
    <Dialog
        title="Set Marketplace Allowance"
        helpText={<HelpText />}
        actions={{
            next: {
                title: 'Set',
                onClick: () => onSet(),
            },
        }}
    >
        {waiting ? (
            <div>
                Waiting for metamask...
            </div>
        ) : (
            <div>
                This allows the marketplace to transfer the required amount of DATA.
            </div>
        )}
    </Dialog>
)

SetAllowanceDialog.defaultProps = {
    waiting: false,
}

export default SetAllowanceDialog
