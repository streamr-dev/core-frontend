// @flow

import React, { type ComponentType, useCallback, forwardRef } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

export type Props = {
    selectAllOnFocus?: boolean,
    onFocus?: ?(SyntheticFocusEvent<EventTarget>) => void,
}

const SelectAllOnFocusDecorator = (WrappedComponent: ComponentType<any>) => {
    const SelectAllOnFocusDecoratorWrapper = ({ onFocus: onFocusProp, ...props }: Props, ref: any) => {
        const isMounted = useIsMounted()

        const onFocus = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            e.persist()

            setTimeout(() => {
                if (isMounted() && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                    e.target.select()
                }
            }, 0)

            if (onFocusProp) {
                onFocusProp(e)
            }
        }, [onFocusProp, isMounted])

        return (
            <WrappedComponent
                {...props}
                onFocus={onFocus}
                ref={ref}
            />
        )
    }

    const SelectAllOnFocusDecoratorWrapperFR: ComponentType<Props> = forwardRef(SelectAllOnFocusDecoratorWrapper)

    const OptInSelectAllOnFocusDecoratorWrapper = ({ selectAllOnFocus = false, ...props }: Props, ref: any) => (
        selectAllOnFocus ? (
            <SelectAllOnFocusDecoratorWrapperFR {...props} ref={ref} />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )
    )

    return (forwardRef(OptInSelectAllOnFocusDecoratorWrapper): ComponentType<Props>)
}

export default SelectAllOnFocusDecorator
