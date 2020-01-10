// @flow

import React, { type ComponentType, useCallback, useRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'

type Props = {
    onBlur?: ?(SyntheticFocusEvent<EventTarget>) => void,
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    onCommit?: ?(string) => void,
    onFocus?: ?(SyntheticFocusEvent<EventTarget>) => void,
    onKeyDown?: ?(SyntheticKeyboardEvent<EventTarget>) => void,
    smartCommit?: boolean,
}

const OnCommitDecorator = (WrappedComponent: ComponentType<any>) => {
    const OnCommitDecoratorWrapper = ({
        onBlur: onBlurProp,
        onChange: onChangeProp,
        onCommit,
        onFocus: onFocusProp,
        onKeyDown: onKeyDownProp,
        smartCommit,
        ...props
    }: Props) => {
        const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
            if (onCommit && !smartCommit) {
                onCommit(e.target.value)
            }

            if (onChangeProp) {
                onChangeProp(e)
            }
        }, [onChangeProp, onCommit, smartCommit])

        const onKeyDown = useCallback((e: SyntheticKeyboardEvent<EventTarget>) => {
            if (onCommit && e.key === 'Enter' && smartCommit && e.target instanceof HTMLInputElement) {
                onCommit(e.target.value)
            }

            if (onKeyDownProp) {
                onKeyDownProp(e)
            }
        }, [onKeyDownProp, onCommit, smartCommit])

        const valueRef: Ref<string> = useRef(null)

        const onFocus = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            if (e.target instanceof HTMLInputElement) {
                valueRef.current = e.target.value
            }

            if (onFocusProp) {
                onFocusProp(e)
            }
        }, [onFocusProp])

        const onBlur = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            if (e.target instanceof HTMLInputElement) {
                const { value } = e.target

                if (onCommit && smartCommit && valueRef.current !== value) {
                    onCommit(value)
                }
            }

            if (onBlurProp) {
                onBlurProp(e)
            }
        }, [onBlurProp, onCommit, smartCommit])

        return (
            <WrappedComponent
                {...props}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
            />
        )
    }

    return OnCommitDecoratorWrapper
}

export default OnCommitDecorator
