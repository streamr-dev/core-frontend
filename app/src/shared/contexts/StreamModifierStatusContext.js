import { createContext, useContext } from 'react'

const StreamModifierStatusContext = createContext({
    busy: false,
    clean: true,
})

export function useStreamModifierStatusContext() {
    return useContext(StreamModifierStatusContext)
}

export default StreamModifierStatusContext
