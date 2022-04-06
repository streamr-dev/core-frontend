import React, { useRef } from 'react'
import StreamContext from '$shared/contexts/StreamContext'
import StreamModifier from '$shared/components/StreamModifier'
import ValidationError from '$shared/errors/ValidationError'
import StreamPage from './StreamPage'

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

    return (
        <StreamContext.Provider value={stream}>
            <StreamModifier onValidate={onValidate}>
                <StreamPage />
            </StreamModifier>
        </StreamContext.Provider>
    )
}
