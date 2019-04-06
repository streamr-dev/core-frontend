// @flow

import React, { useState, useCallback, Fragment } from 'react'
import TextControl from '../TextControl'
import styles from './editableText.pcss'
import Measurer from './Measurer'

type Props = {
    children?: string,
    onChange?: (string) => void,
}

const EditableText = ({ children, onChange: onChangeProp }: Props) => {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(children || '')
    const [width, setWidth] = useState(0)
    const onDoubleClick = useCallback(() => {
        setValue(children || '')
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
            onDoubleClick={onDoubleClick}
            style={{
                width: `${width}px`,
            }}
        >
            {editing ? (
                <Fragment>
                    <TextControl
                        autoFocus
                        flushHistoryOnBlur
                        immediateCommit={false}
                        onBlur={onBlur}
                        onChange={onChange}
                        onCommit={onChangeProp}
                        revertOnEsc
                        selectAllOnFocus
                        value={children || ''}
                    />
                    <Measurer onResult={setWidth}>
                        {value}
                    </Measurer>
                </Fragment>
            ) : children}
        </div>
    )
}

EditableText.defaultProps = {
    onChange: () => {},
}

export default EditableText
