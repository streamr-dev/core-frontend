import React, { useRef } from 'react'
import StreamContext from '$shared/contexts/StreamContext'
import StreamModifier from '$shared/components/StreamModifier'
import Display from '$shared/components/Display'
import ValidationError from '$shared/errors/ValidationError'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import CodeSnippetsSection from './AbstractStreamEditPage/CodeSnippetsSection'
import StatusSection from './AbstractStreamEditPage/StatusSection'
import PreviewSection from './AbstractStreamEditPage/PreviewSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import ConfigSection from './AbstractStreamEditPage/ConfigSection'

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

    const { busy } = useStreamModifierStatusContext()

    return (
        <StreamContext.Provider value={stream}>
            <StreamModifier onValidate={onValidate}>
                <StreamPage>
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
                            status="inactive"
                        />
                    </Display>
                    <PreviewSection
                        disabled
                        subscribe={false}
                    />
                    <Display
                        $mobile="none"
                        $desktop
                    >
                        <HistorySection
                            desc={null}
                            disabled={busy}
                        />
                    </Display>
                    <PartitionsSection
                        disabled={busy}
                    />
                </StreamPage>
            </StreamModifier>
        </StreamContext.Provider>
    )
}
