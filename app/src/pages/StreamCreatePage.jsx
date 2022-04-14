import React, { useRef } from 'react'
import { StreamPermission } from 'streamr-client'
import StreamContext from '$shared/contexts/StreamContext'
import StreamPermissionsContext from '$shared/contexts/StreamPermissionsContext'
import Display from '$shared/components/Display'
import ValidationError from '$shared/errors/ValidationError'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import CodeSnippetsSection from './AbstractStreamEditPage/CodeSnippetsSection'
import StatusSection from './AbstractStreamEditPage/StatusSection'
import PreviewSection from './AbstractStreamEditPage/PreviewSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import ConfigSection from './AbstractStreamEditPage/ConfigSection'

function UnwrappedStreamCreatePage() {
    const { busy } = useStreamModifierStatusContext()

    return (
        <StreamPage title="Name your Stream">
            <InfoSection
                disabled={busy}
            />
            <CodeSnippetsSection
                disabled
            />
            <Display
                $mobile="none"
                $desktop
            >
                <ConfigSection
                    disabled={busy}
                />
            </Display>
            <Display
                $mobile="none"
                $desktop
            >
                <StatusSection
                    disabled={busy}
                />
            </Display>
            <PreviewSection
                disabled
            />
            <Display
                $mobile="none"
                $desktop
            >
                <HistorySection
                    disabled={busy}
                />
            </Display>
            <PartitionsSection
                disabled={busy}
            />
        </StreamPage>
    )
}

export default function StreamCreatePage() {
    const { current: stream } = useRef({
        id: undefined,
        description: '',
        config: {
            fields: [],
        },
        storageDays: undefined,
        inactivityThresholdHours: undefined,
        partitions: 1,
    })

    const { current: onValidate } = useRef(({ id }) => {
        if (!id) {
            throw new ValidationError('cannot be blank')
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
