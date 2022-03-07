import { useContext } from 'react'
import StreamIdContext from '$shared/contexts/StreamIdContext'

export default function useStreamId() {
    return useContext(StreamIdContext)
}
