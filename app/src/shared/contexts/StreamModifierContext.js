import { createContext } from 'react'

const StreamModifierContext = createContext({
    commit: () => {},
    discard: () => {},
    stage: () => {},
})

export default StreamModifierContext
