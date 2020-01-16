// @flow

import React, { type ComponentType, useState, useCallback, useEffect, forwardRef } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'

type Props = {
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    value?: string,
}

const sanitizeValue = (value: any): string => (
    value != null ? value : ''
)

const StatefulInputDecorator = (WrappedComponent: ComponentType<any>) => {
    const StatefulInputDecoratorWrapper = ({ onChange: onChangeProp, value: valueProp, ...props }: Props, ref: any) => {
        const [value, setValue]: UseStateTuple<string> = useState(sanitizeValue(valueProp))

        useEffect(() => {
            setValue(sanitizeValue(valueProp))
        }, [valueProp])

        const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
            if (onChangeProp) {
                onChangeProp(e)
            }

            setValue(e.target.value)
        }, [onChangeProp])

        return (
            <WrappedComponent
                {...props}
                onChange={onChange}
                ref={ref}
                value={value}
            />
        )
    }

    return (forwardRef(StatefulInputDecoratorWrapper): ComponentType<Props>)
}

export default StatefulInputDecorator
