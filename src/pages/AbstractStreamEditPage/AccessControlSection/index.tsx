import React from 'react'
import { StreamPermission } from '@streamr/sdk'
import { useCurrentStreamAbility } from '~/shared/stores/streamAbilities'
import { StreamDraft } from '~/stores/streamDraft'
import { Route as R } from '~/utils/routes'
import Section from '../Section'
import { PermissionList } from './PermissionList'
import { StreamTypeSelector } from './StreamTypeSelector'

export function AccessControlSection({ disabled: disabledProp = false }) {
    const { id: streamId } = StreamDraft.useEntity() || {}

    const canGrant = useCurrentStreamAbility(streamId, StreamPermission.GRANT)

    const disabled = disabledProp || !canGrant

    return (
        <Section title="Access control">
            <p>
                You can make your stream public, or grant access to specific Ethereum
                accounts. Learn more about stream access control from the{' '}
                <a href={R.docs()}>docs</a>.
            </p>
            <StreamTypeSelector disabled={disabled} />
            <PermissionList disabled={disabled} />
        </Section>
    )
}
