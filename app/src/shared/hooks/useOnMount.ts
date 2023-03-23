import { useEffect, useRef } from 'react'
import { Ref } from '$shared/types/common-types'
import '$shared/types/common-types'
export default (onMount: () => void | Promise<void>) => {
    const ref: Ref<(...args: Array<any>) => any> = useRef(onMount)
    useEffect(() => {
        const { current } = ref

        if (current) {
            current()
        }
    }, [])
}
