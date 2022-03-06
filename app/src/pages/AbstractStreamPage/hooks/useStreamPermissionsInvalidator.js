import { useContext } from 'react'
import StreamPermissionsInvalidatorContext from '../contexts/StreamPermissionsInvalidatorContext'

export default function useStreamPermissionsInvalidator() {
    return useContext(StreamPermissionsInvalidatorContext)
}
