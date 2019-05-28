// @flow

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import debounce from 'lodash/debounce'
import cx from 'classnames'
import SvgIcon from '$shared/components/SvgIcon'
import styles from './search.pcss'

type Props = {
    onChange?: ?(string) => void,
    placeholder?: ?string,
    value: ?string,
}

const Search = ({ value: valueProp, onChange: onChangeProp, placeholder }: Props) => {
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

    const debouncedOnChange = useCallback(debounce((value: string) => {
        if (onChangeProp) {
            onChangeProp(value)
        }
    }, 500), [onChangeProp])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        setValue(value)
        debouncedOnChange(value)
    }, [debouncedOnChange])

    const inputRef: Ref<HTMLInputElement> = useRef(null)

    const reset = useCallback(() => {
        const { current: input } = inputRef

        setValue('')

        if (onChangeProp) {
            onChangeProp('')
        }

        if (input) {
            input.blur()
        }
    }, [onChangeProp])

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
