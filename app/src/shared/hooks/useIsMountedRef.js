// @flow

import { useEffect, useRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'

export default () => {
    const ref: Ref<boolean> = useRef(true)

    useEffect(() => () => {
        ref.current = false
    }, [])

    return ref
}
