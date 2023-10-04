import React from 'react'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'

export function SponsorshipPaymentTokenName() {
    return <>{useSponsorshipTokenInfo()?.symbol || 'DATA'}</>
}
