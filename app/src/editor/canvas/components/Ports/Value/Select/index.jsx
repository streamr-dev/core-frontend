// @flow

import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { type CommonProps } from '..'
import styles from './select.pcss'

type Props = CommonProps & {
    options: Array<{
        name?: string,
        text?: string, // sidebar options use 'text' instead of 'name' :/
        value: any,
    }>,
}

const Select = ({
    className,
    disabled,
    onChange: onChangeProp,
    value,
    title,
    options,
    ...props
}: Props) => {
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onChangeProp(e.target.value)
    }, [onChangeProp])

    if (value == null) { value = undefined } // select doesn't want null value

    const optionMap = useMemo(() => (
        options.reduce((memo, { name, text, value }) => {
            if (value == null) { value = undefined }
            memo.set(value, name != null ? name : text)
            return memo
        }, new Map())
    ), [options])

    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.inner}>
                <select
                    {...props}
                    title={title != null ? title : value}
                    className={styles.control}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                >
                    {options.map(({ name, text, value }) => (
                        <option key={value} value={value}>{name != null ? name : text}</option>
                    ))}
                </select>
                {/* `select` holding a currently selected value. This hidden (`visibility: hidden`) control
                    dictates the width of the actual (visible) control above. */}
                <select className={styles.spaceholder}>
                    <option>{optionMap.get(value)}</option>
                </select>
            </div>
        </div>
    )
}

export default Select
