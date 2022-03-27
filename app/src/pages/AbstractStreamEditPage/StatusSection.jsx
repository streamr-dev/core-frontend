import React from 'react'
import styled from 'styled-components'
import { StatusIcon } from '@streamr/streamr-layout'
import TOCPage from '$shared/components/TOCPage'
import Label from '$ui/Label'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'

export default function StatusSection({ disabled, status = StatusIcon.INACTIVE, duration, onChange }) {
    return (
        <TOCPage.Section
            disabled={disabled}
            id="status"
            status={<StatusIcon
                tooltip
                status={status}
            />}
            title="Status"
        >
            <Description>
                If no new data is published to this stream, it will be shown as inactive after this period of time.
                {' '}
                Adjust the threshold to an appropriate period for your stream&apos;s frequency.
            </Description>
            <Label htmlFor="inactivityValue">
                Inactivity threshold
            </Label>
            <UnitizedQuantity
                units={{
                    hour: 1,
                    day: 24,
                }}
                disabled={disabled}
                onChange={onChange}
                quantity={duration}
            />
        </TOCPage.Section>
    )
}

const Description = styled.p`
    margin-bottom: 3rem;
`
