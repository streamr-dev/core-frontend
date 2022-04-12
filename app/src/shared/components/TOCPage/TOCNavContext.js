import { createContext, useContext } from 'react'

const TOCNavContext = createContext(false)

export function useIsWithinNav() {
    return useContext(TOCNavContext)
}

export default TOCNavContext

