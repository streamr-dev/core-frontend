import type { ComponentType } from 'react'
import React, { useCallback, useRef, forwardRef } from 'react'
import type { Ref } from '$shared/types/common-types'
import '$shared/types/common-types'

const sanitise = (value) => (value == null ? '' : value)

const normalize = (value: any): string => (typeof value === 'string' ? value.trim() : String(sanitise(value)))

export type Props = {
    onBlur?: ((arg0: React.FocusEvent<EventTarget>) => void) | null | undefined
    onChange?: ((arg0: React.SyntheticEvent<EventTarget>) => void) | null | undefined
    onCommit?: ((arg0: string) => void) | null | undefined
    onFocus?: ((arg0: React.FocusEvent<EventTarget>) => void) | null | undefined
    onKeyDown?: ((arg0: React.KeyboardEvent<EventTarget>) => void) | null | undefined
    smartCommit?: boolean
    noEmptyCommit?: boolean
}

const OnCommitDecorator = (WrappedComponent: ComponentType<any>) => {
    const OnCommitDecoratorWrapper = (
        {
            noEmptyCommit,
            onBlur: onBlurProp,
            onChange: onChangeProp,
            onCommit: onCommitProp,
            onFocus: onFocusProp,
            onKeyDown: onKeyDownProp,
            smartCommit,
            ...props
        }: Props,
        ref: any,
    ) => {
        const valueRef: Ref<string> = useRef(null)
        const onCommit = useCallback(
            (value: string, requireChanged = false) => {
                if (onCommitProp) {
                    const newValue = noEmptyCommit ? normalize(value) : value

                    if ((!requireChanged || valueRef.current !== value) && (newValue || !noEmptyCommit)) {
                        onCommitProp(value)
                    }
                }
            },
            [onCommitProp, noEmptyCommit],
        )
        const onChange = useCallback(
            (e: React.SyntheticEvent<EventTarget>) => {
                if (!smartCommit) {
                    onCommit(e.target.value)
                }

                if (onChangeProp) {
                    onChangeProp(e)
                }
            },
            [onChangeProp, onCommit, smartCommit],
        )
        const onKeyDown = useCallback(
            (e: React.KeyboardEvent<EventTarget>) => {
                if (e.key === 'Enter' && smartCommit && e.target instanceof HTMLInputElement) {
                    onCommit(e.target.value)
                }

                if (onKeyDownProp) {
                    onKeyDownProp(e)
                }
            },
            [onKeyDownProp, onCommit, smartCommit],
        )
        const onFocus = useCallback(
            (e: React.FocusEvent<EventTarget>) => {
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                    valueRef.current = e.target.value
                }

                if (onFocusProp) {
                    onFocusProp(e)
                }
            },
            [onFocusProp],
        )
        const onBlur = useCallback(
            (e: React.FocusEvent<EventTarget>) => {
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                    const { value } = e.target

                    if (smartCommit) {
                        onCommit(value, true)
                    }
                }

                if (onBlurProp) {
                    onBlurProp(e)
                }
            },
            [onBlurProp, onCommit, smartCommit],
        )
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

    const OptInOnCommitDecorator = ({ onCommit, smartCommit, noEmptyCommit, ...props }: Props, ref: any) =>
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

    return forwardRef(OptInOnCommitDecorator) as ComponentType<Props>
}

export default OnCommitDecorator
