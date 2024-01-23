import React from 'react'
import { IconButton } from '~/components/IconButton'
import { CopyIcon } from '~/icons'
import useCopy from '~/shared/hooks/useCopy'

export function CopyButton({ value = '' }) {
    const { copy } = useCopy()

    return (
        <IconButton type="button" onClick={() => void copy(value)}>
            <CopyIcon />
        </IconButton>
    )
}
