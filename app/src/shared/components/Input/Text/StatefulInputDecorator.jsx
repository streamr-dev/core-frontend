// @flow

import React, { type ComponentType, useState, useCallback } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'

type Props = {
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    value?: string,
}

const StatefulInputDecorator = (WrappedComponent: ComponentType<any>) => {
    const StatefulInputDecoratorWrapper = ({ onChange: onChangeProp, value: valueProp, ...props }: Props) => {
        const [value, setValue]: UseStateTuple<string> = useState(valueProp || '')

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
