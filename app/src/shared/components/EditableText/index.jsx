// @flow

import React, { useState, useCallback, Fragment } from 'react'
import TextControl from '../TextControl'
import styles from './editableText.pcss'

type Props = {
    children?: string,
    editing?: boolean,
    onChange?: (string) => void,
    setEditing: (boolean) => void,
}

const EditableText = ({
    editing,
    setEditing,
    children: childrenProp,
    onChange: onChangeProp,
    editing: editingProp,
    ...props
}: Props) => {
    const children: string = childrenProp || EditableText.defaultProps.children
    const [value, setValue] = useState(children)
    const onDoubleClick = useCallback(() => {
        setValue(children)
        setEditing(true)
    }, [children])
    const onBlur = useCallback(() => {
        setEditing(false)
    })
    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setValue(e.target.value)
    })

    return (
        <div
            className={styles.root}
        >
            <span
                className={styles.inner}
                onDoubleClick={onDoubleClick}
            >
                {editing ? (
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
    children: '',
    onChange: () => {},
}

export default EditableText
