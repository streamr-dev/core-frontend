// @flow

import React, { useState } from 'react'
import EditableText from '$shared/components/EditableText'
import { type CommonProps } from '..'

type Props = CommonProps & {}

const Text = ({ disabled, onChange, value, ...props }: Props) => {
    const [editing, setEditing] = useState(false)

    return (
        <EditableText
            {...props}
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
