// @flow

import React, { type ComponentType, useState, forwardRef, useEffect, useCallback } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'

type Props = {
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    onKeyDown?: ?(SyntheticKeyboardEvent<EventTarget>) => void,
    revertOnEscape?: ?(boolean) => void,
    value?: string,
}

const sanitizeValue = (value: any): string => (
    value != null ? value : ''
)

const RevertOnEscapeDecorator = (WrappedComponent: ComponentType<any>) => {
    const RevertOnEscapeDecoratorWrapper = ({
        revertOnEscape,
        value: valueProp,
        onKeyDown: onKeyDownProp,
        onChange: onChangeProp,
        ...props
    }: Props, ref: any) => {
        const [value, setValue]: UseStateTuple<string> = useState(sanitizeValue(valueProp))

        useEffect(() => {
            setValue(sanitizeValue(valueProp))
        }, [valueProp])

        const onKeyDown = useCallback((e: SyntheticKeyboardEvent<EventTarget>) => {
            if (e.key === 'Escape') {
                setValue(sanitizeValue(valueProp))
            }

            if (onKeyDownProp) {
                onKeyDownProp(e)
            }
        }, [valueProp, onKeyDownProp])

        const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
            setValue(e.target.value)

            if (onChangeProp) {
                onChangeProp(e)
            }
        }, [onChangeProp])

        return (
            <WrappedComponent
                {...props}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={ref}
                value={value}
            />
        )
    }

    return (forwardRef(RevertOnEscapeDecoratorWrapper): ComponentType<Props>)
}

export default RevertOnEscapeDecorator
