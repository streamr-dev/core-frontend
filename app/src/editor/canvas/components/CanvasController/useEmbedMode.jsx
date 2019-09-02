import React, { useContext } from 'react'

export const EmbedModeContext = React.createContext(false)

export function useEmbedMode() {
    return useContext(EmbedModeContext)
}

export default useEmbedMode
