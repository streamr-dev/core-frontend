// @flow

import React, { type ComponentType, useCallback, useRef, forwardRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'

const sanitise = (value) => (
    value == null ? '' : value
)

const normalize = (value: any): string => (
    typeof value === 'string' ? value.trim() : String(sanitise(value))
)

export type Props = {
    onBlur?: ?(SyntheticFocusEvent<EventTarget>) => void,
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    onCommit?: ?(string) => void,
    onFocus?: ?(SyntheticFocusEvent<EventTarget>) => void,
    onKeyDown?: ?(SyntheticKeyboardEvent<EventTarget>) => void,
    smartCommit?: boolean,
    noEmptyCommit?: boolean,
}

const OnCommitDecorator = (WrappedComponent: ComponentType<any>) => {
    const OnCommitDecoratorWrapper = ({
        noEmptyCommit,
        onBlur: onBlurProp,
        onChange: onChangeProp,
        onCommit: onCommitProp,
        onFocus: onFocusProp,
        onKeyDown: onKeyDownProp,
        smartCommit,
        ...props
    }: Props, ref: any) => {
        const valueRef: Ref<string> = useRef(null)

        const onCommit = useCallback((value: string, requireChanged: boolean = false) => {
            if (onCommitProp) {
                const newValue = noEmptyCommit ? normalize(value) : value

                if ((!requireChanged || valueRef.current !== value) && (newValue || !noEmptyCommit)) {
                    onCommitProp(value)
                }
            }
        }, [onCommitProp, noEmptyCommit])

        const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
            if (!smartCommit) {
                onCommit(e.target.value)
            }

            if (onChangeProp) {
                onChangeProp(e)
            }
        }, [onChangeProp, onCommit, smartCommit])

        const onKeyDown = useCallback((e: SyntheticKeyboardEvent<EventTarget>) => {
            if (e.key === 'Enter' && smartCommit && e.target instanceof HTMLInputElement) {
                onCommit(e.target.value)
            }

            if (onKeyDownProp) {
                onKeyDownProp(e)
            }
        }, [onKeyDownProp, onCommit, smartCommit])

        const onFocus = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                valueRef.current = e.target.value
            }

            if (onFocusProp) {
                onFocusProp(e)
            }
        }, [onFocusProp])

        const onBlur = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                const { value } = e.target

                if (smartCommit) {
                    onCommit(value, true)
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
                ref={ref}
            />
        )
    }

    const OnCommitDecoratorWrapperFR: ComponentType<Props> = forwardRef(OnCommitDecoratorWrapper)

    const OptInOnCommitDecorator = ({ onCommit, smartCommit, noEmptyCommit, ...props }: Props, ref: any) => (
        onCommit ? (
            <OnCommitDecoratorWrapperFR
                {...props}
                noEmptyCommit={noEmptyCommit}
                onCommit={onCommit}
                ref={ref}
                smartCommit={smartCommit}
            />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )
    )

    return (forwardRef(OptInOnCommitDecorator): ComponentType<Props>)
}

export default OnCommitDecorator
