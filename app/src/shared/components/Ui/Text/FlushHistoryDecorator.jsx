// @flow

import React, { type ComponentType, useCallback, useState, forwardRef } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'

export type Props = {
    flushHistoryOnBlur?: boolean,
    onBlur?: ?(SyntheticFocusEvent<EventTarget>) => void,
}

const FlushHistoryDecorator = (WrappedComponent: ComponentType<any>) => {
    const FlushHistoryDecoratorWrapper = ({ onBlur: onBlurProp, ...props }: Props, ref: any) => {
        const [blurCount, setBlurCount]: UseStateTuple<number> = useState(0)

        const onBlur = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            // `blurCount` is used as `key` of the actual control. Changing it replaces the control
            // with a new instance thus the old instance along with its change history gets forgotten.
            setBlurCount((count) => count + 1)

            if (onBlurProp) {
                onBlurProp(e)
            }
        }, [onBlurProp])

        return (
            <WrappedComponent
                {...props}
                ref={ref}
                key={blurCount}
                onBlur={onBlur}
            />
        )
    }

    const FlushHistoryDecoratorWrapperFR: ComponentType<Props> = forwardRef(FlushHistoryDecoratorWrapper)

    const OptInFlushHistoryDecorator = ({ flushHistoryOnBlur = false, ...props }: Props, ref: any) => (
        flushHistoryOnBlur ? (
            <FlushHistoryDecoratorWrapperFR {...props} ref={ref} />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )
    )

    return (forwardRef(OptInFlushHistoryDecorator): ComponentType<Props>)
}

export default FlushHistoryDecorator
