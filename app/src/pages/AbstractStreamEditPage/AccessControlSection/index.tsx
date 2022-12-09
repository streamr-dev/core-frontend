import React from 'react'

import { StreamPermission } from 'streamr-client'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import PermissionsProvider from '$shared/components/PermissionsProvider'
import useStreamId from '$shared/hooks/useStreamId'
import StreamTypeSelector from './StreamTypeSelector'
import PermissionList from './PermissionList'

export type Props = {
    disabled: boolean,
}

const AccessControlSection: React.FunctionComponent<Props> = ({ disabled: disabledProp }) => {
    const streamId = useStreamId()
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()
    const disabled = disabledProp || !canEdit

    return (
        <PermissionsProvider resourceId={streamId} resourceType={'STREAM'}>
            <TOCSection id="accessControl" title="Access control">
                <p>
                    You can make your stream public, or grant access to specific Ethereum accounts.
                    Learn more about stream access control from the docs.
                </p>
                <StreamTypeSelector disabled={disabled} />
                <PermissionList disabled={disabled} />
            </TOCSection>
        </PermissionsProvider>
    )
}

export default AccessControlSection
