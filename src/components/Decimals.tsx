import React, { ReactNode, useMemo } from 'react'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { abbr } from '~/utils'
import { BN, toFloat } from '~/utils/bn'

interface DecimalsProps {
    amount: bigint
    decimals: bigint
    raw?: boolean
    unit?: ReactNode
}

export function Decimals({ amount, decimals, raw = false, unit }: DecimalsProps) {
    const value = useMemo(
        () => ((x: BN) => (raw ? x.toString() : abbr(x)))(toFloat(amount, decimals)),
        [raw, amount, decimals],
    )

    return (
        <>
            {value}
            {unit != null ? <>&nbsp;{unit}</> : <></>}
        </>
    )
}

interface SponsorshipDecimalsProps {
    amount: bigint
    raw?: boolean
    unitSuffix?: ReactNode
}

export function SponsorshipDecimals({
    amount,
    raw = false,
    unitSuffix,
}: SponsorshipDecimalsProps) {
    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    return (
        <Decimals
            amount={amount}
            decimals={decimals}
            raw={raw}
            unit={
                <>
                    <SponsorshipPaymentTokenName />
                    {unitSuffix}
                </>
            }
        />
    )
}
