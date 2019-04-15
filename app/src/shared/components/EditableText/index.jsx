// @flow

import React, { useState, useCallback, Fragment } from 'react'
import cx from 'classnames'
import ModuleHeader from '$editor/shared/components/ModuleHeader'
import TextControl from '../TextControl'
import styles from './editableText.pcss'

type Props = {
    children?: string | number,
    className?: ?string,
    disabled?: boolean,
    editing?: boolean,
    editOnFocus?: boolean,
    onChange?: (string) => void,
    placeholder?: ?string,
    setEditing: (boolean) => void,
}

const EditableText = ({
    children: childrenProp,
    className,
    disabled,
    editing,
    editOnFocus,
    onChange: onChangeProp,
    placeholder,
    setEditing,
    ...props
}: Props) => {
    const children = childrenProp == null ? EditableText.defaultProps.children : childrenProp
    const [value, setValue] = useState(children)
    const [hasFocus, setHasFocus] = useState(false)
    const startEditing = useCallback(() => {
        if (!disabled) {
            setValue(children)
            setEditing(true)
        }
    }, [disabled, children])
    const onBlur = useCallback(() => {
        setHasFocus(false)
        setEditing(false)
    })
    const onFocus = useCallback(() => {
        setHasFocus(true)
    })
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setValue(e.target.value)
    })

    return (
        <div
            className={cx(styles.root, className, {
                [styles.idle]: !editing,
                [styles.disabled]: disabled,
                [ModuleHeader.styles.dragCancel]: !!editing,
            })}
            onDoubleClick={startEditing}
            {...((editOnFocus && !disabled) ? {
                onFocus: startEditing,
                // In order to allow shift-tabbing through interactive elements
                // we can't let the span be focusable when the input is.
                tabIndex: (hasFocus ? -1 : 0),
            } : {})}
        >
            <span className={styles.inner}>
                {editing && !disabled ? (
                    <Fragment>
                        <TextControl
                            {...props}
                            autoFocus
                            flushHistoryOnBlur
                            immediateCommit={false}
                            onBlur={onBlur}
                            onChange={onChange}
                            onCommit={onChangeProp}
                            onFocus={onFocus}
                            placeholder={placeholder}
                            revertOnEsc
                            selectAllOnFocus
                            value={children}
                        />
                        <span className={styles.spaceholder}>
                            {value || placeholder || ''}
                        </span>
                    </Fragment>
                ) : (children || placeholder)}
            </span>
        </div>
    )
}

EditableText.defaultProps = {
    children: '',
    className: null,
    editOnFocus: false,
    onChange: () => {},
}

export default EditableText
