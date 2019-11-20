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

const sanitise = (value) => (
    value == null ? '' : value
)

const normalize = (value: any): string => (
    typeof value === 'string' ? value.trim() : String(sanitise(value))
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
    const normalizedValueProp = normalize(valueProp)
    const [value, setValue] = useState(normalizedValueProp)
    const [hasFocus, setFocus] = useState(false)

    const [blurCount, setBlurCount] = useState(0)
    const commit = useCallback(() => {
        const normalizedValue = normalize(value)
        if (onCommit && normalizedValue !== normalizedValueProp && (normalizedValue || commitEmpty)) {
            onCommit(normalizedValue)
        }
    }, [normalizedValueProp, value, onCommit, commitEmpty])

    const onBlur = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        if (flushHistoryOnBlur) {
            // `blurCount` is used as `key` of the actual control. Changing it replaces the control
            // with a new instance thus the old instance along with its change history gets forgotten.
            setBlurCount((count) => count + 1)
        }

        if (!immediateCommit) {
            commit()
        }

        setFocus(false)
        if (onBlurProp) {
            onBlurProp(e)
        }
    }, [onBlurProp, flushHistoryOnBlur, commit, immediateCommit])

    const onFocus = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setValue(normalizedValueProp)
        if (selectAllOnFocus) {
            e.target.select()
        }

        setFocus(true)

        if (onFocusProp) {
            onFocusProp(e)
        }
    }, [onFocusProp, selectAllOnFocus, normalizedValueProp])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value: newValue } = e.target

        setValue(newValue)

        if (onChangeProp) {
            onChangeProp(e)
        }
    }, [onChangeProp])

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
                        if (value === normalizedValueProp) {
                            // No change. Re-render won't happen. We can blur right away!
                            input.blur()
                        } else {
                            // If the value changed then we have to wait with the `blur`
                            // for another render. `onBlur` has to know current `value`.
                            setValue(normalizedValueProp)
                            reverted.current = true
                        }
                    } else {
                        input.blur()
                    }
                    break
                default:
                    break
            }
        }

        if (onKeyDownProp) {
            onKeyDownProp(e)
        }
    }, [onKeyDownProp, revertOnEsc, immediateCommit, normalizedValueProp, tag, ref, value])

    useEffect(() => {
        const { current: input } = ref
        const { current: wasAborted } = reverted
        if (input && wasAborted) {
            reverted.current = false
            input.blur()
        }
    })

    useEffect(() => {
        if (immediateCommit) {
            commit()
        }
    }, [immediateCommit, commit])

    const displayedValue = hasFocus ? value : normalizedValueProp

    return (
        <Tag
            {...props}
            key={blurCount}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            ref={ref}
            value={displayedValue}
        />
    )
}

TextControl.defaultProps = {
    commitEmpty: false,
    flushHistoryOnBlur: false,
    immediateCommit: true,
    innerRef: null,
    revertOnEsc: false,
    selectAllOnFocus: false,
    tag: 'input',
}

export default TextControl
