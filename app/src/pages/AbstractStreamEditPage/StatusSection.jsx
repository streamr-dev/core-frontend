import React, { Fragment, useEffect, useRef, useState } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import { StatusIcon } from '@streamr/streamr-layout'
import TOCPage from '$shared/components/TOCPage'
import Label from '$ui/Label'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import useStreamActivityStatus from '$shared/hooks/useStreamActivityStatus'
import useStream from '$shared/hooks/useStream'

function UnwrappedStatusSection({ disabled, canEdit, onStatusChange }) {
    const { stage } = useStreamModifier()

    const { inactivityThresholdHours } = useTransientStream()

    const stream = useStream() || {}

    const [status] = useStreamActivityStatus(stream.inactivityThresholdHours)

    const onStatusChangeRef = useRef(onStatusChange)

    useEffect(() => {
        onStatusChangeRef.current = onStatusChange
    }, [onStatusChange])

    useEffect(() => {
        if (typeof onStatusChangeRef.current === 'function') {
            onStatusChangeRef.current(status)
        }
    }, [status])

    return (
        <Fragment>
            {!!canEdit && (
                <Description>
                    If no new data is published to this stream, it will be shown as inactive after this period of time.
                    {' '}
                    Adjust the threshold to an appropriate period for your stream&apos;s frequency.
                </Description>
            )}
            <Label htmlFor="inactivityValue">
                Inactivity threshold
            </Label>
            <UnitizedQuantity
                units={{
                    hour: 1,
                    day: 24,
                }}
                disabled={disabled}
                onChange={(value) => void stage({
                    inactivityThresholdHours: value,
                })}
                quantity={inactivityThresholdHours}
            />
        </Fragment>
    )
}

const Description = styled.p`
    margin-bottom: 3rem;
`

export default function StatusSection({ disabled: disabledProp, ...props }) {
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    const [status, setStatus] = useState(StatusIcon.INVACTIVE)

    return (
        <TOCPage.Section
            disabled={disabled}
            id="status"
            status={(
                <StatusIcon
                    tooltip
                    status={status}
                />
            )}
            title="Status"
        >
            {!isWithinNav && (
                <UnwrappedStatusSection
                    {...props}
                    canEdit={canEdit}
                    disabled={disabled}
                    onStatusChange={setStatus}
                />
            )}
        </TOCPage.Section>
    )
}
