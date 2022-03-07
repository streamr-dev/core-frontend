import { useContext } from 'react'
import StreamPermissionsInvalidatorContext from '$shared/contexts/StreamPermissionsInvalidatorContext'

export default function useStreamPermissionsInvalidator() {
    return useContext(StreamPermissionsInvalidatorContext)
}
