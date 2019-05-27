// @flow

import React, { useState, useEffect, useCallback } from 'react'
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

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        if (onChangeProp) {
            onChangeProp(e.target.value)
        }
    }, [onChangeProp])

    return (
        <div
            className={cx(styles.root, {
                [styles.open]: open,
            })}
        >
            <div className={styles.inner}>
                <SvgIcon name="search" className={styles.loupe} />
                <input
                    onBlur={onBlur}
                    onChange={onChange}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    type="text"
                    value={value}
                />
            </div>
            <div />
        </div>
    )
}

export default Search
