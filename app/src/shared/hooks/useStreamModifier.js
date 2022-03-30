import { useContext } from 'react'
import StreamModifierContext from '$shared/contexts/StreamModifierContext'

export default function useStreamModifier() {
    return useContext(StreamModifierContext)
}
