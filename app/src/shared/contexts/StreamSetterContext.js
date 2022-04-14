import { createContext, useContext } from 'react'

const StreamSetterContext = createContext(() => {})

export function useStreamSetter() {
    return useContext(StreamSetterContext)
}

export default StreamSetterContext
