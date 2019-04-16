// @flow

import React from 'react'
import StreamSelector from '$editor/shared/components/StreamSelector'
import { type CommonProps } from '..'
import styles from './stream.pcss'

type Props = CommonProps & {}

const Stream = ({ disabled, onChange, value, ...props }: Props) => (
    <StreamSelector
        {...props}
        className={styles.root}
        disabled={disabled}
        onChange={onChange}
        value={value}
    />
)

export default Stream
