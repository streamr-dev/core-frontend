// @flow

import React, { useState } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import { type CommonProps } from '..'
import styles from './text.pcss'

type Props = CommonProps & {}

const Text = ({ disabled, onChange, value, ...props }: Props) => {
    const [editing, setEditing] = useState(false)

    return (
        <EditableText
            {...props}
            className={cx(styles.root, {
                [styles.editing]: editing,
                [styles.disabled]: disabled,
            })}
            commitEmpty
            disabled={disabled}
            editing={editing}
            editOnFocus
            onChange={onChange}
            setEditing={setEditing}
        >
            {value}
        </EditableText>
    )
}

export default Text
