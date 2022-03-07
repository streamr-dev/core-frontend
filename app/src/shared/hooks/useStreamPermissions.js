import { useContext } from 'react'
import StreamPermissionsContext from '$shared/contexts/StreamPermissionsContext'

export default function useStreamPermissions() {
    return useContext(StreamPermissionsContext)
}
