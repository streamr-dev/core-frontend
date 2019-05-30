// @flow

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import debounce from 'lodash/debounce'
import cx from 'classnames'
import SvgIcon from '$shared/components/SvgIcon'
import useIsMounted from '$shared/hooks/useIsMounted'
import styles from './search.pcss'

type Props = {
    onChange?: ?(string) => void,
    placeholder?: ?string,
    value: ?string,
}

const Search = ({ value: valueProp, onChange: onChangeProp, placeholder }: Props) => {
    const isMounted = useIsMounted()

    const [value, setValue] = useState(valueProp || '')

    const [focused, setFocused] = useState(false)

    const open = !!(focused || value)

    useEffect(() => {
        setValue(valueProp || '')
    }, [valueProp])

    const onFocus = useCallback(() => {
        setFocused(true)
    }, [])

    const onBlur = useCallback(() => {
        setFocused(false)
    }, [])

    const defineDebouncedOnChange = useCallback((onChange: ?(string) => void) => (
        debounce((value: string) => {
            if (isMounted() && onChange) {
                onChange(value)
            }
        }, 500)
    ), [isMounted])

    const debouncedOnChangeRef: Ref<Function> = useRef(defineDebouncedOnChange(onChangeProp))

    useEffect(() => {
        const { current: debouncedOnChange } = debouncedOnChangeRef

        // We have to cancel all pending `debouncedOnChange` every time `onChangeProp` changes.
        if (debouncedOnChange) {
            debouncedOnChange.cancel()
        }

        debouncedOnChangeRef.current = defineDebouncedOnChange(onChangeProp)
    }, [onChangeProp, defineDebouncedOnChange])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        setValue(value)
        const { current: debouncedOnChange } = debouncedOnChangeRef

        if (debouncedOnChange) {
            debouncedOnChange(value)
        }
    }, [])

    const inputRef: Ref<HTMLInputElement> = useRef(null)

    const reset = useCallback(() => {
        const { current: input } = inputRef

        if (value !== '') {
            setValue('')

            if (onChangeProp) {
                onChangeProp('')
            }
        }

        if (input) {
            input.blur()
        }
    }, [value, onChangeProp])

    return (
        <div
            className={cx(styles.root, {
                [styles.open]: open,
            })}
        >
            <div className={styles.inner}>
                <div className={styles.inputWrapper}>
                    <input
                        onBlur={onBlur}
                        onChange={onChange}
                        onFocus={onFocus}
                        placeholder={placeholder}
                        ref={inputRef}
                        type="text"
                        value={value}
                    />
                </div>
                <SvgIcon name="search" className={styles.loupe} />
                <div className={styles.cursorHolder} />
            </div>
            <div className={styles.closeButtonWrapper}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={reset}
                    tabIndex="-1"
                >
                    <SvgIcon name="crossMedium" />
                </button>
            </div>
        </div>
    )
}

export default Search
