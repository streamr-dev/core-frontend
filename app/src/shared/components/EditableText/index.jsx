// @flow

import React, { useState, useCallback, Fragment, useEffect, useRef, type Node } from 'react'
import cx from 'classnames'
import { type Ref } from '$shared/flowtype/common-types'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import TextControl from '../TextControl'
import styles from './editableText.pcss'

type Props = {
    id?: string,
    autoFocus?: boolean,
    title?: string,
    children?: string | number,
    className?: ?string,
    disabled?: boolean,
    editing?: boolean,
    editOnFocus?: boolean,
    selectAllOnFocus?: boolean,
    onChange?: (string) => void,
    blankClassName?: string,
    onCommit?: (string) => void,
    onModeChange?: ?(boolean) => void,
    placeholder?: ?string,
    probe?: Node,
    setEditing: (boolean) => void,
}

function isBlank(str) {
    return str == null || str === ''
}

const EditableText = ({
    autoFocus,
    children: childrenProp,
    className,
    disabled,
    editing,
    editOnFocus,
    selectAllOnFocus,
    onChange: onChangeProp,
    blankClassName,
    onCommit,
    onModeChange,
    placeholder,
    probe,
    setEditing,
    title,
    ...props
}: Props) => {
    const children = (childrenProp == null) ? EditableText.defaultProps.children : childrenProp
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

    const onChange = useCallback(({ target: { value: val } }: SyntheticInputEvent<EventTarget>) => {
        setValue(val)
        if (onChangeProp) {
            onChangeProp(val)
        }
    }, [onChangeProp])

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

    const renderValue = useCallback((val) => (
        !isBlank(val) ? val : (placeholder || '')
    ), [placeholder])
    const valueIsBlank = isBlank(editing ? value : children)
    return (
        <div
            className={cx(styles.root, className, {
                [styles.idle]: !editing,
                [styles.disabled]: disabled,
                [styles.blank]: valueIsBlank,
                [ModuleStyles.dragCancel]: !!editing,
            }, valueIsBlank ? blankClassName : undefined)}
            onDoubleClick={startEditing}
            {...((editOnFocus && !disabled) ? {
                onFocus: startEditing,
                // In order to allow shift-tabbing through interactive elements
                // we can't let the span be focusable when the input is.
                tabIndex: (hasFocus ? -1 : 0),
            } : {})}
            title={title}
        >
            <span className={styles.inner}>
                {probe}
                {editing && !disabled ? (
                    <Fragment>
                        <TextControl
                            {...props}
                            immediateCommit={false}
                            autoComplete="off"
                            autoFocus
                            flushHistoryOnBlur
                            onBlur={onBlur}
                            onChange={onChange}
                            onCommit={onCommit}
                            onFocus={onFocus}
                            placeholder={placeholder}
                            revertOnEsc
                            selectAllOnFocus={selectAllOnFocus}
                            spellCheck="false"
                            value={children}
                        />
                        <span className={styles.spaceholder}>
                            {renderValue(value)}
                        </span>
                    </Fragment>
                ) : (
                    <React.Fragment>
                        {renderValue(children)}
                        {/* fake input to capture focus from label click */}
                        <input
                            className={styles.hiddenInput}
                            id={props.id}
                            onFocus={onFocus}
                            disabled={disabled}
                            tabIndex="-1"
                        />
                    </React.Fragment>
                )}
            </span>
        </div>
    )
}

EditableText.defaultProps = {
    children: '',
    className: null,
    editOnFocus: false,
    selectAllOnFocus: true,
    immediateCommit: false,
    onChange: () => {},
}

export default EditableText
