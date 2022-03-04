import { useContext } from 'react'
import StreamPermissionsContext from '../contexts/StreamPermissionsContext'

export default function useStreamPermissions() {
    return useContext(StreamPermissionsContext)
}
