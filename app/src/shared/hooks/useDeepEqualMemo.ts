import isEqual from 'lodash/isEqual'
import { useRef } from 'react'

function useDeepEqualMemo<T>(value: T): T {
    const ref = useRef<T | undefined>(undefined)

    if (!isEqual(ref.current, value)) {
        ref.current = value
    }

    return ref.current
}

export default useDeepEqualMemo