import React, { ReactNode, createContext, useContext } from 'react'

const NewStreamContext = createContext(false)

function useNewStreamContext() {
    return useContext(NewStreamContext)
}

function NewStreamContextProvider({ children }: { children?: ReactNode }) {
    return <NewStreamContext.Provider value={true}>{children}</NewStreamContext.Provider>
}

export { NewStreamContextProvider, NewStreamContextProvider as default, useNewStreamContext }
