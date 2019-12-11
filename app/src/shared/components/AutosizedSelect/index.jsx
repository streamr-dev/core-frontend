// @flow

// TODO: Use it for $editor/canvas/components/Ports/Value/Select. — Mariusz

import React, { useState, useCallback, useEffect, useMemo, type ChildrenArray, type Element } from 'react'
import cx from 'classnames'
import styles from './autosizedSelect.pcss'

type Props = {
    className?: ?string,
    value: any,
    onChange: (any) => void,
    children: ChildrenArray<Element<'option'> | boolean>,
}

const AutosizedSelect = ({
    children,
    className,
    onChange: onChangeProp,
    value: valueProp,
    ...props
}: Props) => {
    const [value, setValue] = useState(valueProp || '')

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const val = e.target.value || ''
        setValue(val)
        onChangeProp(val)
    }, [onChangeProp])

    useEffect(() => {
        setValue(valueProp || '')
    }, [valueProp])

    const currentLabel = useMemo(() => {
        const currentOption = React.Children.toArray(children).find((child) => (
            typeof child !== 'boolean' && String(value) === (String(child.props.value) || '')
        ))
        return currentOption && typeof currentOption !== 'boolean' ? currentOption.props.children : null
    }, [value, children])

    return (
        <div
            className={cx(styles.root, className)}
        >
            <select
                {...props}
                className={styles.control}
                value={value}
                onChange={onChange}
                // Force single selected value. Other cases are unsupported.
                multiple={false}
            >
                {children}
            </select>
            <select className={styles.spaceholder}>
                {!!currentLabel && (
                    <option>{currentLabel}</option>
                )}
            </select>
        </div>
    )
}

export default AutosizedSelect
