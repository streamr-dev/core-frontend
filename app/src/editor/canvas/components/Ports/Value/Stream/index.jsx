// @flow

import React, { useCallback, useContext } from 'react'
import StreamSelector from '$editor/shared/components/StreamSelector'
import { Context as SizeConstraintContext } from '$editor/canvas/components/Resizable/SizeConstraintProvider'
import { type CommonProps } from '..'

type Props = CommonProps & {}

const Stream = ({ disabled, onChange: onChangeProp, value, ...props }: Props) => {
    const { refreshProbes } = useContext(SizeConstraintContext)
    const onUpdate = useCallback(() => {
        refreshProbes()
    }, [refreshProbes])
    const onChange = useCallback((...args) => {
        onChangeProp(...args)
        refreshProbes()
    }, [refreshProbes, onChangeProp])

    return (
        <StreamSelector
            {...props}
            disabled={disabled}
            onChange={onChange}
            onUpdate={onUpdate}
            value={value}
        />
    )
}

export default Stream
