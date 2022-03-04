import { useContext } from 'react'
import StreamPermissionsReloaderContext from '../contexts/StreamPermissionsReloaderContext'

export default function useStreamPermissionsReloader() {
    return useContext(StreamPermissionsReloaderContext)
}
