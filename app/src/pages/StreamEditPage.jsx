import React from 'react'
import { StreamPermission } from 'streamr-client'
import StreamModifier from '$shared/components/StreamModifier'
import Display from '$shared/components/Display'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import CodeSnippetsSection from './AbstractStreamEditPage/CodeSnippetsSection'
import StatusSection from './AbstractStreamEditPage/StatusSection'
import PreviewSection from './AbstractStreamEditPage/PreviewSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import ConfigSection from './AbstractStreamEditPage/ConfigSection'

function UnwrappedStreamEditPage() {
    const { busy } = useStreamModifierStatusContext()

    const { [StreamPermission.EDIT]: canEdit } = useStreamPermissions()

    const title = canEdit
        ? 'Set up your stream'
        : 'Read only stream'

    const loading = typeof canEdit === 'undefined'

    return (
        <StreamPage
            title={title}
            loading={loading}
        >
            <InfoSection
                disabled={busy}
            />
            <CodeSnippetsSection />
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
                    status="inactive"
                />
            </Display>
            <PreviewSection />
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
    return (
        <AbstractStreamPage
            streamOperations={[
                StreamPermission.EDIT,
                StreamPermission.GRANT,
                StreamPermission.SUBSCRIBE,
            ]}
        >
            <StreamModifier>
                <UnwrappedStreamEditPage />
            </StreamModifier>
        </AbstractStreamPage>
    )
}
