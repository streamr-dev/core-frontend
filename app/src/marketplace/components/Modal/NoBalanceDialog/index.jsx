// @flow

import React from 'react'
import BN from 'bignumber.js'

import GetCryptoDialog from '../GetCryptoDialog'
import GetDataTokensDialog from '../GetDataTokensDialog'
import InsufficientDataDialog from '../InsufficientDataDialog'

export type Props = {
    onCancel: () => void,
    requiredEthBalance: BN,
    currentEthBalance: BN,
    requiredDataBalance: BN,
    currentDataBalance: BN,
}

const NoBalanceDialog = ({
    onCancel,
    requiredEthBalance,
    currentEthBalance,
    requiredDataBalance,
    currentDataBalance,
}: Props) => {
    if (currentEthBalance.isLessThan(requiredEthBalance) || currentEthBalance.isZero()) {
        return <GetCryptoDialog onCancel={onCancel} />
    }

    if (currentDataBalance.isZero()) {
        return <GetDataTokensDialog onCancel={onCancel} />
    }

    if (currentDataBalance.isLessThan(requiredDataBalance)) {
        return <InsufficientDataDialog onCancel={onCancel} />
    }

    return null
}

export default NoBalanceDialog
