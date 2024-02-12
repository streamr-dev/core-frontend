import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentStreamAbility2 } from '~/shared/stores/streamAbilities'
import { StreamDraft } from '~/stores/streamDraft'
import Section from '../Section'
import { PermissionList } from './PermissionList'
import { StreamTypeSelector } from './StreamTypeSelector'

export function AccessControlSection({ disabled: disabledProp = false }) {
    const { id: streamId } = StreamDraft.useEntity() || {}

    const canGrant = useCurrentStreamAbility2(streamId, StreamPermission.GRANT)

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
