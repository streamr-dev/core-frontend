// @flow

import { createContext, useContext, type Context } from 'react'

type ModuleApi = {
    moduleSidebarOpen: (boolean) => void,
    port: {
        onChange: (any, any) => void,
        setPortOptions: () => void,
    },
    selectModule: (any) => void,
    setCanvas: (any, (any) => void, ?() => void) => void,
    [string]: () => void,
}

export const ModuleApiContext = (createContext({
    moduleSidebarOpen: () => {},
    port: {
        onChange: () => {},
        setPortOptions: () => {},
    },
    selectModule: () => {},
    setCanvas: () => {},
}): Context<ModuleApi>)

export default (): ModuleApi => useContext(ModuleApiContext)
