// @flow

import React, { type ComponentType, useCallback, forwardRef } from 'react'

type Props = {
    selectAllOnFocus?: boolean,
    onFocus?: ?(SyntheticFocusEvent<EventTarget>) => void,
}

const SelectAllOnFocusDecorator = (WrappedComponent: ComponentType<any>) => {
    const SelectAllOnFocusDecoratorWrapper = ({ onFocus: onFocusProp, selectAllOnFocus = false, ...props }: Props, ref: any) => {
        const onFocus = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            if (selectAllOnFocus && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                e.target.select()
            }

            if (onFocusProp) {
                onFocusProp(e)
            }
        }, [onFocusProp, selectAllOnFocus])

        return (
            <WrappedComponent
                {...props}
                onFocus={onFocus}
                ref={ref}
            />
        )
    }

    return (forwardRef(SelectAllOnFocusDecoratorWrapper): ComponentType<Props>)
}

export default SelectAllOnFocusDecorator
