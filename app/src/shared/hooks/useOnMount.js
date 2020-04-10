// @flow

import { useEffect, useRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'

export default (onMount: () => void | Promise<void>) => {
    const ref: Ref<Function> = useRef(onMount)

    useEffect(() => {
        const { current } = ref

        if (current) {
            current()
        }
    }, [])
}
