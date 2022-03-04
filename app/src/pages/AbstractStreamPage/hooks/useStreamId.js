import { useContext } from 'react'
import StreamIdContext from '../contexts/StreamIdContext'

export default function useStreamId() {
    return useContext(StreamIdContext)
}
