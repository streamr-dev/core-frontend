import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentStreamAbility } from '$shared/stores/streamAbilities'
import Section from '../Section'
import StreamTypeSelector from './StreamTypeSelector'
import PermissionList from './PermissionList'

export type Props = {
    disabled: boolean
}

const AccessControlSection: React.FunctionComponent<Props> = ({
    disabled: disabledProp,
}) => {
    const canGrant = useCurrentStreamAbility(StreamPermission.GRANT)

    const disabled = disabledProp || !canGrant

    return (
        <Section title="Access control">
            <p>
                You can make your stream public, or grant access to specific Ethereum
                accounts. Learn more about stream access control from the{' '}
                <a href="https://docs.streamr.network/">docs</a>.
            </p>
            <StreamTypeSelector disabled={disabled} />
            <PermissionList disabled={disabled} />
        </Section>
    )
}

export default AccessControlSection
