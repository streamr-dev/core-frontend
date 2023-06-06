import { ComponentType } from 'react'
import React, { useCallback, useState, forwardRef } from 'react'
import '$shared/types/common-types'
export type Props = {
    flushHistoryOnBlur?: boolean
    onBlur?: ((arg0: React.FocusEvent<EventTarget>) => void) | null | undefined
}

const FlushHistoryDecorator = (WrappedComponent: ComponentType<any>) => {
    const FlushHistoryDecoratorWrapper = (
        { onBlur: onBlurProp, ...props }: Props,
        ref: any,
    ) => {
        const [blurCount, setBlurCount] = useState(0)
        const onBlur = useCallback(
            (e: React.FocusEvent<EventTarget>) => {
                // `blurCount` is used as `key` of the actual control. Changing it replaces the control
                // with a new instance thus the old instance along with its change history gets forgotten.
                setBlurCount((count) => count + 1)

                if (onBlurProp) {
                    onBlurProp(e)
                }
            },
            [onBlurProp],
        )
        return <WrappedComponent {...props} ref={ref} key={blurCount} onBlur={onBlur} />
    }

    const FlushHistoryDecoratorWrapperFR = forwardRef(FlushHistoryDecoratorWrapper)

    const OptInFlushHistoryDecorator = (
        { flushHistoryOnBlur = false, ...props }: Props,
        ref: any,
    ) =>
        flushHistoryOnBlur ? (
            <FlushHistoryDecoratorWrapperFR {...props} ref={ref} />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )

    return forwardRef(OptInFlushHistoryDecorator) as ComponentType<Props>
}

export default FlushHistoryDecorator
