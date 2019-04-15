// @flow

import React from 'react'
import { type CommonProps } from '..'
import MapParam from '../../MapParam'

type Props = CommonProps & {
    port: any,
}

const Map = ({
    disabled,
    onChange,
    port,
    value,
    ...props
}: Props) => (
    <MapParam
        {...props}
        disabled={disabled}
        onChange={onChange}
        port={port}
        value={value}
    />
)

export default Map
