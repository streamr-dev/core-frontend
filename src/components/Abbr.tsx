import React from 'react'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { Tooltip } from '~/components/Tooltip'
import { abbr } from '~/utils'
import { BNish } from '~/utils/bn'

/**
 * @todo Integrate with `Decimals` component and deprecate.
 */
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
