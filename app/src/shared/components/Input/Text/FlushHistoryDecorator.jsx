// @flow

import React, { type ComponentType, useCallback, useState, forwardRef } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'

type Props = {
    flushHistoryOnBlur?: boolean,
    onBlur?: ?(SyntheticFocusEvent<EventTarget>) => void,
}

const FlushHistoryDecorator = (WrappedComponent: ComponentType<any>) => {
    const FlushHistoryDecoratorWrapper = ({ onBlur: onBlurProp, flushHistoryOnBlur = false, ...props }: Props, ref: any) => {
        const [blurCount, setBlurCount]: UseStateTuple<number> = useState(0)

        const onBlur = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            if (flushHistoryOnBlur) {
                // `blurCount` is used as `key` of the actual control. Changing it replaces the control
                // with a new instance thus the old instance along with its change history gets forgotten.
                setBlurCount((count) => count + 1)
            }

            if (onBlurProp) {
                onBlurProp(e)
            }
        }, [onBlurProp, flushHistoryOnBlur])

        return (
            <WrappedComponent
                {...props}
                ref={ref}
                key={blurCount}
                onBlur={onBlur}
            />
        )
    }

    return (forwardRef(FlushHistoryDecoratorWrapper): ComponentType<Props>)
}

export default FlushHistoryDecorator
