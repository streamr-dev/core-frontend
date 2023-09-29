import React from 'react'
import { config } from '@streamr/config'
import useTokenInfo from '~/hooks/useTokenInfo'
import getCoreConfig from '~/getters/getCoreConfig'

export function SponsorshipPaymentTokenName() {
    const { id: chainId, contracts } = config[getCoreConfig().defaultChain || 'polygon']

    const tokenAddress = contracts[getCoreConfig().sponsorshipPaymentToken]

    const tokenInfo = useTokenInfo(tokenAddress, chainId)

    return <>{tokenInfo?.symbol || 'DATA'}</>
}
