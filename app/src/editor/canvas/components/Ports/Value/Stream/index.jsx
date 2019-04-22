// @flow

import React from 'react'
import StreamSelector from '$editor/shared/components/StreamSelector'
import { type CommonProps } from '..'

type Props = CommonProps & {}

const Stream = ({ disabled, onChange, value, ...props }: Props) => (
    <StreamSelector
        {...props}
        disabled={disabled}
        onChange={onChange}
        value={value}
    />
)

export default Stream
