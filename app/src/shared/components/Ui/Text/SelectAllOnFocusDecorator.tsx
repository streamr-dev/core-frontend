import { ComponentType } from 'react'
import React, { useCallback, forwardRef } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
export type Props = {
    selectAllOnFocus?: boolean
    onFocus?: ((arg0: React.FocusEvent<EventTarget>) => void) | null | undefined
}

const SelectAllOnFocusDecorator = (WrappedComponent: ComponentType<any>) => {
    const SelectAllOnFocusDecoratorWrapper = ({ onFocus: onFocusProp, ...props }: Props, ref: any) => {
        const isMounted = useIsMounted()
        const onFocus = useCallback(
            (e: React.FocusEvent<EventTarget>) => {
                e.persist()
                setTimeout(() => {
                    if (
                        isMounted() &&
                        (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
                    ) {
                        e.target.select()
                    }
                }, 0)

                if (onFocusProp) {
                    onFocusProp(e)
                }
            },
            [onFocusProp, isMounted],
        )
        return <WrappedComponent {...props} onFocus={onFocus} ref={ref} />
    }

    const SelectAllOnFocusDecoratorWrapperFR = forwardRef(SelectAllOnFocusDecoratorWrapper)

    const OptInSelectAllOnFocusDecoratorWrapper = ({ selectAllOnFocus = false, ...props }: Props, ref: any) =>
        selectAllOnFocus ? (
            <SelectAllOnFocusDecoratorWrapperFR {...props} ref={ref} />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )

    return forwardRef(OptInSelectAllOnFocusDecoratorWrapper) as ComponentType<Props>
}

export default SelectAllOnFocusDecorator
