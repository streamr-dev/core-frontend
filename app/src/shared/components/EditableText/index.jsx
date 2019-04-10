// @flow

import React, { useState, useCallback, Fragment } from 'react'
import cx from 'classnames'
import ModuleHeader from '$editor/shared/components/ModuleHeader'
import TextControl from '../TextControl'
import styles from './editableText.pcss'

type Props = {
    children?: string,
    className?: string,
    disabled?: boolean,
    editing?: boolean,
    onChange?: (string) => void,
    setEditing: (boolean) => void,
}

const EditableText = ({
    children: childrenProp,
    className,
    disabled,
    editing,
    editing: editingProp,
    onChange: onChangeProp,
    setEditing,
    ...props
}: Props) => {
    const children: string = childrenProp || EditableText.defaultProps.children
    const [value, setValue] = useState(children)
    const onDoubleClick = useCallback(() => {
        if (!disabled) {
            setValue(children)
            setEditing(true)
        }
    }, [children])
    const onBlur = useCallback(() => {
        setEditing(false)
    })
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setValue(e.target.value)
    })

    return (
        <div
            className={cx(styles.root, className, {
                [styles.idle]: !editing,
            })}
        >
            <span
                className={cx(styles.inner, {
                    [ModuleHeader.styles.dragCancel]: !!editing,
                })}
                onDoubleClick={onDoubleClick}
            >
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
                            revertOnEsc
                            selectAllOnFocus
                            value={children}
                        />
                        <span className={styles.spaceholder}>
                            {value}
                        </span>
                    </Fragment>
                ) : children}
            </span>
        </div>
    )
}

EditableText.defaultProps = {
    className: '',
    children: '',
    onChange: () => {},
}

export default EditableText
