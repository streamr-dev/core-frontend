// @flow

import React, { useCallback, type Node, useRef, useState, useEffect } from 'react'
import { type Ref } from '$shared/flowtype/common-types'

type TextControlRef = Ref<HTMLTextAreaElement | HTMLInputElement>

type Props = {
    commitEmpty?: boolean,
    flushHistoryOnBlur?: boolean,
    immediateCommit?: boolean,
    innerRef?: ?TextControlRef,
    onBlur?: ?(SyntheticInputEvent<EventTarget>) => void,
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
    onCommit?: ?(string) => void,
    onFocus?: ?(SyntheticInputEvent<EventTarget>) => void,
    onKeyDown?: ?(SyntheticKeyboardEvent<EventTarget>) => void,
    revertOnEsc?: boolean,
    selectAllOnFocus?: boolean,
    tag?: 'input' | 'textarea',
    value?: string | number,
}

const normalize = (value: any): string => (
    typeof value === 'string' ? value.trim() : String(value)
)

const TextControl = ({
    commitEmpty,
    flushHistoryOnBlur,
    immediateCommit,
    innerRef,
    onBlur: onBlurProp,
    onChange: onChangeProp,
    onCommit,
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    revertOnEsc,
    selectAllOnFocus,
    tag,
    value: valueProp,
    ...props
}: Props): Node => {
    const Tag = tag || TextControl.defaultProps.tag
    const el = useRef(null)
    const ref = innerRef || el
    const reverted: Ref<boolean> = useRef(false)
    const [value, setValue] = useState(valueProp == null ? '' : valueProp)
    const [blurCount, setBlurCount] = useState(0)
    const normalizedValue = normalize(value)
    const commit = useCallback(() => {
        if (onCommit && normalizedValue !== normalize(valueProp) && (normalizedValue || commitEmpty)) {
            onCommit(normalizedValue)
        }
    }, [normalizedValue, valueProp, onCommit, commitEmpty])

    const onBlur = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        if (flushHistoryOnBlur) {
            // `blurCount` is used as `key` of the actual control. Changing it replaces the control
            // with a new instance thus the old instance along with its change history gets forgotten.
            setBlurCount(blurCount + 1)
        }

        if (!immediateCommit) {
            commit()
        }

        if (!commitEmpty && !normalizedValue) {
            setValue(valueProp)
        }

        if (onBlurProp) {
            onBlurProp(e)
        }
    }, [onBlurProp, flushHistoryOnBlur, commit, valueProp, commitEmpty, normalizedValue])

    const onFocus = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        if (selectAllOnFocus) {
            e.target.select()
        }

        if (onFocusProp) {
            onFocusProp(e)
        }
    }, [onFocusProp, selectAllOnFocus])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value: newValue } = e.target

        setValue(newValue)

        if (onChangeProp) {
            onChangeProp(e)
        }

        if (immediateCommit) {
            commit()
        }
    }, [immediateCommit, onChangeProp, commit])

    const onKeyDown = useCallback((e: SyntheticKeyboardEvent<EventTarget>) => {
        const { current: input } = ref

        if (input) {
            switch (e.key) {
                case 'Enter':
                    if (!immediateCommit && tag !== 'textarea') {
                        input.blur()
                    }
                    break
                case 'Escape':
                    if (revertOnEsc) {
                        setValue(valueProp)
                        reverted.current = true
                    }
                    break
                default:
                    break
            }
        }

        if (onKeyDownProp) {
            onKeyDownProp(e)
        }
    }, [onKeyDownProp, revertOnEsc, immediateCommit, valueProp, tag])

    useEffect(() => {
        const { current: input } = ref
        const { current: wasAborted } = reverted
        if (input && wasAborted) {
            reverted.current = false
            input.blur()
        }
    })

    return (
        <Tag
            {...props}
            key={blurCount}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            ref={ref}
            value={value}
        />
    )
}

TextControl.defaultProps = {
    flushHistoryOnBlur: false,
    commitEmpty: false,
    immediateCommit: true,
    innerRef: null,
    revertOnEsc: false,
    selectAllOnFocus: false,
    tag: 'input',
}

export default TextControl
