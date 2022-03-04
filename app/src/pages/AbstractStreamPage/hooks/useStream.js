import { useContext } from 'react'
import StreamContext from '../contexts/StreamContext'

export default function useStream() {
    return useContext(StreamContext)
}
