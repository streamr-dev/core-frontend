import React from 'react'
import { abbr } from '~/utils'
import { BNish } from '~/utils/bn'
import { Tooltip } from '~/components/Tooltip'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'

export function Abbr({ children, suffix }: { children: BNish; suffix?: string }) {
    const abbreviated = abbr(children)

    const stringified = children.toString()

    const unit = (
        <>
            <SponsorshipPaymentTokenName />
            {suffix}
        </>
    )

    if (abbreviated === stringified) {
        return (
            <>
                {stringified}&nbsp;{unit}
            </>
        )
    }

    return (
        <Tooltip
            anchorDisplay="inline"
            content={
                <>
                    {stringified}&nbsp;{unit}
                </>
            }
        >
            {abbreviated}&nbsp;{unit}
        </Tooltip>
    )
}
