import { createContext } from 'react'

type StreamPermissionsContextProps = {
    [key: string]: boolean,
}

const StreamPermissionsContext = createContext<StreamPermissionsContextProps>({})
export default StreamPermissionsContext
