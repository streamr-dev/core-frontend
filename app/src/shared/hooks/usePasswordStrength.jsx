// @flow

import React, { useEffect, useState } from 'react'
import { Translate } from 'react-redux-i18n'
import useIsMounted from '$shared/hooks/useIsMounted'
import zxcvbn from '$utils/zxcvbn'
import { type UseStateTuple } from '$shared/flowtype/common-types'
import * as Colors from '$ui/StateColors'

type StrengthMessageProps = {
    strength: number,
}

export const strengthToState = (strength: number): $Keys<typeof Colors> => (
    ['DEFAULT', 'ERROR', 'CAUTION', 'SUCCESS'][strength + 1]
)

export const StrengthMessage = ({ strength }: StrengthMessageProps) => ([
    null,
    <Translate key="weak" value="auth.password.strength.weak" />,
    <Translate key="moderate" value="auth.password.strength.moderate" />,
    <Translate key="strong" value="auth.password.strength.strong" />,
][strength + 1])

export default (value: string): number => {
    const isMounted = useIsMounted()

    const [strength, setStrength]: UseStateTuple<number> = useState(-1)

    useEffect(() => {
        (async () => (
            value ? [0, 1, 1, 2, 2][(await zxcvbn())(value || '').score] : -1
        ))().then((s) => {
            if (isMounted()) {
                setStrength(s)
            }
        })
    }, [value, isMounted])

    return strength
}
