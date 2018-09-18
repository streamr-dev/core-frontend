// @flow

import React from 'react'

import GetCryptoDialog from '../GetCryptoDialog/index'
import GetDataTokensDialog from '../GetDataTokensDialog/index'

export type Props = {
    onCancel: () => void,
    hasEthBalance: boolean,
}

const NoBalanceDialog = ({ onCancel, hasEthBalance }: Props) => {
    if (hasEthBalance) {
        return <GetDataTokensDialog onCancel={onCancel} />
    }

    return <GetCryptoDialog onCancel={onCancel} />
}

export default NoBalanceDialog
