import { useContext } from 'react'

import { Context as UndoContext } from '$shared/components/UndoContextProvider'

export default function useProduct() {
    const { state } = useContext(UndoContext)
    return state
}
