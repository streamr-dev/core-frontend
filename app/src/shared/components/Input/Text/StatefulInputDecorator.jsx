// @flow

import React, { type ComponentType, useState, useCallback, useEffect } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'

type Props = {
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    value?: string,
}

const sanitizeValue = (value: any): string => (
    value != null ? value : ''
)

const StatefulInputDecorator = (WrappedComponent: ComponentType<any>) => {
    const StatefulInputDecoratorWrapper = ({ onChange: onChangeProp, value: valueProp, ...props }: Props) => {
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
                value={value}
                onChange={onChange}
            />
        )
    }

    return StatefulInputDecoratorWrapper
}

export default StatefulInputDecorator
