import { useContext } from 'react'

import { Context as UndoContext } from '$shared/components/UndoContextProvider'

export default function useOriginalProduct() {
    const { initialState } = useContext(UndoContext)
    return initialState
}
