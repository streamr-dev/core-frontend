import { createContext } from 'react'
const StreamModifierContext = createContext({
    commit: () => {},
    stage: (changes: any) => {},
    goBack: () => {},
})
export default StreamModifierContext
