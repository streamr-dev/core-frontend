import { useEffect, useRef } from 'react'
import type { Ref } from '$shared/flowtype/common-types'
import '$shared/flowtype/common-types'
export default (onMount: () => void | Promise<void>) => {
    const ref: Ref<(...args: Array<any>) => any> = useRef(onMount)
    useEffect(() => {
        const { current } = ref

        if (current) {
            current()
        }
    }, [])
}
