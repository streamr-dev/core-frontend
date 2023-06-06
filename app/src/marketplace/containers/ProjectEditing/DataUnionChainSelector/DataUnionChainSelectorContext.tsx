import React, {
    createContext,
    Dispatch,
    FunctionComponent,
    ReactNode,
    SetStateAction,
    useState,
} from 'react'

export const DataUnionChainSelectorContext =
    createContext<[number, Dispatch<SetStateAction<number>>]>(undefined)

export const DataUnionChainSelectorContextProvider: FunctionComponent<{
    children: ReactNode | ReactNode[]
}> = ({ children }) => {
    return (
        <DataUnionChainSelectorContext.Provider value={useState<number | undefined>()}>
            {children}
        </DataUnionChainSelectorContext.Provider>
    )
}
