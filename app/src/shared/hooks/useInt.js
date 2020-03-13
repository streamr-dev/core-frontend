// @flow

import { useMemo } from 'react'

export default (value: any) => (
    useMemo(() => (
        typeof value === 'number' ? Math.floor(value) : Number.parseInt(value, 10)
    ), [value])
)
