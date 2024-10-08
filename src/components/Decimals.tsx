import React, { ReactNode, useMemo } from 'react'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { Tooltip } from '~/components/Tooltip'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { abbr } from '~/utils'
import { toFloat } from '~/utils/bn'

interface DecimalsProps {
    abbr?: boolean
    amount: bigint
    decimals: bigint
    tooltip?: boolean
    unit?: ReactNode
}

/**
 * Displays amount (in wei) in a human-readable way. Optionally it abbreviates
 * it and adds a on-hover tooltip showing a full value.
 */
export function Decimals({
    abbr: abbrProp = false,
    amount,
    decimals,
    tooltip = false,
    unit,
}: DecimalsProps) {
    const humanAmount = toFloat(amount, decimals)

    const value = useMemo(
        () => (abbrProp ? abbr(humanAmount) : humanAmount.toString()),
        [abbrProp, humanAmount],
    )

    if (value === humanAmount.toString() || !tooltip) {
        return (
            <>
                {value}
                {unit != null ? <>&nbsp;{unit}</> : <></>}
            </>
        )
    }

    return (
        <Tooltip
            anchorDisplay="inline"
            content={
                <>
                    {humanAmount.toString()}
                    {unit != null ? <>&nbsp;{unit}</> : <></>}
                </>
            }
        >
            {value}
            {unit != null ? <>&nbsp;{unit}</> : <></>}
        </Tooltip>
    )
}

interface SponsorshipDecimalsProps {
    abbr?: boolean
    amount: bigint
    tooltip?: boolean
    unitSuffix?: ReactNode
}

export function SponsorshipDecimals({
    abbr = false,
    amount,
    tooltip = false,
    unitSuffix,
}: SponsorshipDecimalsProps) {
    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    return (
        <Decimals
            abbr={abbr}
            amount={amount}
            decimals={decimals}
            tooltip={tooltip}
            unit={
                <>
                    <SponsorshipPaymentTokenName />
                    {unitSuffix}
                </>
            }
        />
    )
}
