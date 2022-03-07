import { useContext } from 'react'
import StreamContext from '$shared/contexts/StreamContext'

export default function useStream() {
    return useContext(StreamContext)
}
