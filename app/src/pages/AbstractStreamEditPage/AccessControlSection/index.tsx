import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentAbility } from '$shared/stores/abilities'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import StreamTypeSelector from './StreamTypeSelector'
import PermissionList from './PermissionList'

export type Props = {
    disabled: boolean,
}

const AccessControlSection: React.FunctionComponent<Props> = ({ disabled: disabledProp }) => {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    return (
        <TOCSection id="accessControl" title="Access control">
            <p>
                You can make your stream public, or grant access to specific Ethereum accounts.
                Learn more about stream access control from the <a href="https://docs.streamr.network/">docs</a>.
            </p>
            <StreamTypeSelector disabled={disabled} />
            <PermissionList disabled={disabled} />
        </TOCSection>
    )
}

export default AccessControlSection
