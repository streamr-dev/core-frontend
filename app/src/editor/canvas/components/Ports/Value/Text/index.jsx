// @flow

import React, { useState } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import { type CommonProps } from '..'
import styles from './text.pcss'

type Props = CommonProps & {
    className?: ?string,
}

const Text = ({
    className,
    disabled,
    onChange,
    value,
    ...props
}: Props) => {
    const [editing, setEditing] = useState(false)

    return (
        <EditableText
            {...props}
            className={cx(styles.root, className, {
                [styles.editing]: editing,
                [styles.disabled]: disabled,
            })}
            blankClassName={styles.blank}
            commitEmpty
            disabled={disabled}
            editing={editing}
            editOnFocus
            onCommit={onChange}
            setEditing={setEditing}
        >
            {value}
        </EditableText>
    )
}

export default Text
