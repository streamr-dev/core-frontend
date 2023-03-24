import React, { useRef } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import StreamContext from '$shared/contexts/StreamContext'
import StreamPermissionsContext from '$shared/contexts/StreamPermissionsContext'
import ValidationError from '$shared/errors/ValidationError'
import DuplicateError from '$shared/errors/DuplicateError'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'

function UnwrappedStreamCreatePage() {
    const { busy } = useStreamModifierStatusContext()
    return (
        <StreamPage title="Name your Stream" showSaveButton={false} fullWidth={false}>
            <InfoSection disabled={busy} />
            <AccessControlSection disabled={busy} />
            <HistorySection disabled={busy} />
            <PartitionsSection disabled={busy} />
        </StreamPage>
    )
}

export default function StreamCreatePage() {
    const { current: stream } = useRef({
        id: undefined,
        metadata: {
            description: '',
            config: {
                fields: [],
            },
            storageDays: undefined,
            inactivityThresholdHours: undefined,
            partitions: 1,
        },
    })
    const { current: onValidate } = useRef(async (stream, client) => {
        if (!stream.id) {
            throw new ValidationError('cannot be blank')
        }

        // Check if stream already exists
        let existingStream = null
        try {
            existingStream = await client.getStream(stream.id)
        } catch (e) {
            // stream does not exist
        }

        if (existingStream != null) {
            throw new DuplicateError()
        }
    })
    const { current: permissions } = useRef({
        [StreamPermission.EDIT]: true,
    })
    return (
        <StreamContext.Provider value={stream}>
            <StreamPermissionsContext.Provider value={permissions}>
                <StreamModifier onValidate={onValidate}>
                    <UnwrappedStreamCreatePage />
                </StreamModifier>
            </StreamPermissionsContext.Provider>
        </StreamContext.Provider>
    )
}
