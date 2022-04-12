import React, { Fragment } from 'react'
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

function UnwrappedStatusSection({ disabled, canEdit }) {
    const { stage } = useStreamModifier()

    const { inactivityThresholdHours } = useTransientStream()

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

export default function StatusSection({ disabled: disabledProp, status = StatusIcon.INACTIVE, ...props }) {
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    // @NOTE: Let's move status checking into the unwrapped component. Don't do that in the nav.

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
                />
            )}
        </TOCPage.Section>
    )
}
