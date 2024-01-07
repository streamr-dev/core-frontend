import React from 'react'
import { abbr } from '~/utils'
import { BNish } from '~/utils/bn'
import { Tooltip } from '~/components/Tooltip'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'

export function Abbr({ children }: { children: BNish }) {
    const abbreviated = abbr(children)

    const stringified = children.toString()

    if (abbreviated === stringified) {
        return (
            <>
                {stringified} <SponsorshipPaymentTokenName />
            </>
        )
    }

    return (
        <Tooltip
            inlineWrap
            content={
                <>
                    {stringified} <SponsorshipPaymentTokenName />
                </>
            }
        >
            {abbreviated} <SponsorshipPaymentTokenName />
        </Tooltip>
    )
}
