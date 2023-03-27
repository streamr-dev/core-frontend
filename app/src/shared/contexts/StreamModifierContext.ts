import { createContext } from 'react'
import { Stream } from 'streamr-client'

type StreamModifierContextType = {
    commit: () => Promise<Stream>,
    stage: (changes: any) => void,
    goBack: () => void,
    isUpdateNeeded: () => boolean,
    validate: () => Promise<void>,
    setBusy: (busy: boolean) => void,
}

const StreamModifierContext = createContext<StreamModifierContextType>({
    commit: () => undefined,
    stage: (changes) => {},
    goBack: () => {},
    isUpdateNeeded: () => false,
    validate: () => undefined,
    setBusy: (busy) => {},
})
export default StreamModifierContext
