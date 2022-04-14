import { createContext } from 'react'

const StreamModifierContext = createContext({
    commit: () => {},
    stage: () => {},
    goBack: () => {},
})

export default StreamModifierContext
