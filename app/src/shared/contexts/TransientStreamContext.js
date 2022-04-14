import { createContext, useContext } from 'react'

const TransientStreamContext = createContext(undefined)

export function useTransientStream() {
    return useContext(TransientStreamContext)
}

export default TransientStreamContext
