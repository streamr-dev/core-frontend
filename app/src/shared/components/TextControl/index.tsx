import React, { useCallback, useRef, useState, useEffect, ReactNode } from 'react'
import type { Ref } from '$shared/types/common-types'
import '$shared/types/common-types'
type TextControlRef = Ref<HTMLTextAreaElement | HTMLInputElement>
type Props = {
    commitEmpty?: boolean
    autoComplete?: string
    autoFocus?: boolean
    flushHistoryOnBlur?: boolean
    immediateCommit?: boolean
    innerRef?: TextControlRef | null | undefined
    onBlur?: ((arg0: React.SyntheticEvent<EventTarget>) => void) | null | undefined
    onChange?: ((arg0: React.SyntheticEvent<EventTarget>) => void) | null | undefined
    onCommit?: ((arg0: string) => void) | null | undefined
    onFocus?: ((arg0: React.SyntheticEvent<EventTarget>) => void) | null | undefined
    onKeyDown?: ((arg0: React.KeyboardEvent<EventTarget>) => void) | null | undefined
    placeholder?: string
    revertOnEsc?: boolean
    selectAllOnFocus?: boolean
    spellCheck?: string | boolean
    tag?: 'input' | 'textarea'
    value?: string | number
}

const sanitise = (value) => (value == null ? '' : value)

const normalize = (value: any): string => (typeof value === 'string' ? value.trim() : String(sanitise(value)))

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
}: Props): ReactNode => {
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
    const onBlur = useCallback(
        (e: React.SyntheticEvent<EventTarget>) => {
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
        },
        [onBlurProp, flushHistoryOnBlur, commit, immediateCommit],
    )
    const onFocus = useCallback(
        (e: React.SyntheticEvent<EventTarget>) => {
            setValue(normalizedValueProp)

            if (selectAllOnFocus) {
                e.target.select()
            }

            setFocus(true)

            if (onFocusProp) {
                onFocusProp(e)
            }
        },
        [onFocusProp, selectAllOnFocus, normalizedValueProp],
    )
    const onChange = useCallback(
        (e: React.SyntheticEvent<EventTarget>) => {
            const { value: newValue } = e.target
            setValue(newValue)

            if (onChangeProp) {
                onChangeProp(e)
            }
        },
        [onChangeProp],
    )
    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<EventTarget>) => {
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
        },
        [onKeyDownProp, revertOnEsc, immediateCommit, normalizedValueProp, tag, ref, value],
    )
    useEffect(() => {
        const { current: input } = ref
        const { current: wasAborted } = reverted

        if (input && wasAborted) {
            reverted.current = false
            input.blur()
        }
    })
    // captured refs for next effect
    const commitRef = useRef(commit)
    commitRef.current = commit
    const immediateCommitRef = useRef()
    immediateCommitRef.current = immediateCommit
    // when value changes do immediate commit if needed
    const normalizedCurrentValue = normalize(value)
    useEffect(() => {
        if (immediateCommitRef.current) {
            commitRef.current()
        }
    }, [normalizedCurrentValue])
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
