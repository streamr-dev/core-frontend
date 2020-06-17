import { useRef } from 'react'
import uniqueId from 'lodash/uniqueId'

export default function useUniqueId(prefix = '') {
    const idRef = useRef()
    if (!idRef.current) {
        idRef.current = uniqueId(prefix)
    }
    return idRef.current
}
