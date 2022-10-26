import { createContext, useContext } from 'react'

type StreamSetterContextProps = React.Dispatch<(prevState: any) => any>

const StreamSetterContext = createContext<StreamSetterContextProps>(() => {})
export function useStreamSetter() {
    return useContext(StreamSetterContext)
}
export default StreamSetterContext
