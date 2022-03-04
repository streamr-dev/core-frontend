import { createContext } from 'react'
import { StreamPermission } from 'streamr-client'

export const initialPermissions = {
    [StreamPermission.EDIT]: undefined,
    [StreamPermission.SUBSCRIBE]: undefined,
}

const StreamPermissionsContext = createContext(initialPermissions)

export default StreamPermissionsContext
