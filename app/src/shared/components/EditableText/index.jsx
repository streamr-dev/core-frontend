// @flow

import React, { useState, useCallback, Fragment, useEffect, useRef } from 'react'
import cx from 'classnames'
import { type Ref } from '$shared/flowtype/common-types'
import ModuleHeader from '$editor/shared/components/ModuleHeader'
import TextControl from '../TextControl'
import styles from './editableText.pcss'

type Props = {
    autoFocus?: boolean,
    children?: string | number,
    className?: ?string,
    disabled?: boolean,
    editing?: boolean,
    editOnFocus?: boolean,
    onChange?: (string) => void,
    onModeChange?: ?(boolean) => void,
    placeholder?: ?string,
    setEditing: (boolean) => void,
}

const EditableText = ({
    autoFocus,
    children: childrenProp,
    className,
    disabled,
    editing,
    editOnFocus,
    onChange: onChangeProp,
    onModeChange,
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
    }, [disabled, children, setValue, setEditing])
    const onBlur = useCallback(() => {
        setHasFocus(false)
        setEditing(false)
    }, [setHasFocus, setEditing])
    const onFocus = useCallback(() => {
        setHasFocus(true)
    }, [setHasFocus])
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setValue(e.target.value)
    }, [setValue])

    const initialRender: Ref<boolean> = useRef(true)

    useEffect(() => {
        // Skip calling `onModeChange` on the initial render.
        if (onModeChange && !initialRender.current) {
            onModeChange(!!editing)
        }
        initialRender.current = false
    }, [onModeChange, editing])

    const onMount: Ref<Function> = useRef(editOnFocus && autoFocus ? startEditing : (() => {}))

    useEffect(() => {
        if (onMount.current) {
            onMount.current()
        }
    }, [])

    return (
        <div
            className={cx(styles.root, className, {
                [styles.idle]: !editing,
                [styles.disabled]: disabled,
                [styles.blank]: (editing && !value) || (!editing && !children),
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
                            autocomplete="off"
                            autoFocus
                            flushHistoryOnBlur
                            onBlur={onBlur}
                            onChange={onChange}
                            onCommit={onChangeProp}
                            onFocus={onFocus}
                            placeholder={placeholder}
                            revertOnEsc
                            selectAllOnFocus
                            spellcheck="false"
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
    immediateCommit: false,
    onChange: () => {},
}

export default EditableText
