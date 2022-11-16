import { createContext, useContext } from 'react'

type StreamSetterContextProps = object

const StreamSetterContext = createContext<StreamSetterContextProps>(() => {})
export function useStreamSetter() {
    return useContext(StreamSetterContext)
}
export default StreamSetterContext
