import { ChangeEvent, ComponentType } from 'react'
import React, { useState, forwardRef, useEffect, useCallback } from 'react'
import '$shared/types/common-types'
export type Props = {
    onChange?: ((arg0: React.SyntheticEvent<EventTarget>) => void) | null | undefined
    onKeyDown?: ((arg0: React.KeyboardEvent<EventTarget>) => void) | null | undefined
    revertOnEscape?: ((arg0: boolean) => void) | null | undefined
    value?: string
}

const sanitizeValue = (value: any): string => (value != null ? value : '')

const RevertOnEscapeDecorator = (WrappedComponent: ComponentType<any>) => {
    const RevertOnEscapeDecoratorWrapper = (
        { value: valueProp, onKeyDown: onKeyDownProp, onChange: onChangeProp, ...props }: Props,
        ref: any,
    ) => {
        const [value, setValue] = useState(sanitizeValue(valueProp))
        useEffect(() => {
            setValue(sanitizeValue(valueProp))
        }, [valueProp])
        const onKeyDown = useCallback(
            (e: React.KeyboardEvent<EventTarget>) => {
                if (e.key === 'Escape') {
                    setValue(sanitizeValue(valueProp))
                }

                if (onKeyDownProp) {
                    onKeyDownProp(e)
                }
            },
            [valueProp, onKeyDownProp],
        )
        const onChange = useCallback(
            (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
                setValue(e.target.value)

                if (onChangeProp) {
                    onChangeProp(e)
                }
            },
            [onChangeProp],
        )
        return <WrappedComponent {...props} onChange={onChange} onKeyDown={onKeyDown} ref={ref} value={value} />
    }

    const RevertOnEscapeDecoratorWrapperFR = forwardRef(RevertOnEscapeDecoratorWrapper)

    const OptInRevertOnEscapeDecoratorWrapper = ({ revertOnEscape, ...props }: Props, ref: any) =>
        revertOnEscape ? (
            <RevertOnEscapeDecoratorWrapperFR {...props} ref={ref} />
        ) : (
            <WrappedComponent {...props} ref={ref} />
        )

    return forwardRef(OptInRevertOnEscapeDecoratorWrapper) as ComponentType<Props>
}

export default RevertOnEscapeDecorator
