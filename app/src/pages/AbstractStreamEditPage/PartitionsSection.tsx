import React, { useState } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import { Advanced } from '$shared/components/StatusLabel'
import { useCurrentAbility } from '$shared/stores/abilities'
import Label from '$ui/Label'
import Numeric from '$ui/Numeric'
import { useCurrentDraft, useUpdateCurrentMetadata } from '$shared/stores/streamEditor'
import Section from './Section'

const PartitionRange = {
    Min: 1,
    Max: 99,
}

const Partitions = styled.div`
    max-width: 136px;
`

const Desc = styled.p`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

export default function PartitionsSection({ disabled: disabledProp = false }) {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const {
        metadata: { partitions },
    } = useCurrentDraft()

    const [value, setValue] = useState(`${partitions}`)

    const updateMetadata = useUpdateCurrentMetadata()

    return (
        <Section title="Stream partitions" status={<Advanced />}>
            <Desc>
                Partitioning enables high-volume streams to scale beyond what a typical
                node can handle. If you&apos;re not sure if your stream needs partitions,
                leave it set to 1.
            </Desc>
            <Partitions>
                <Label>Partitions</Label>
                <Numeric
                    min={PartitionRange.Min}
                    max={PartitionRange.Max}
                    value={value}
                    onChange={({ target }) => {
                        // @TODO Replace "as any" with a real type.
                        const val: string = (target as any).value

                        setValue(val)

                        let sanitizedValue = partitions

                        try {
                            const n = Number.parseInt(val, 10)

                            if (Number.isNaN(n)) {
                                throw new Error('Not a number')
                            }

                            sanitizedValue = Math.max(
                                PartitionRange.Min,
                                Math.min(PartitionRange.Max, n),
                            )
                        } catch (e) {
                            // Do nothing.
                        }

                        updateMetadata((metadata) => {
                            metadata.partitions = sanitizedValue
                        })
                    }}
                    onBlur={() => {
                        // Bring back the recently sanitized
                        setValue(`${partitions}`)
                    }}
                    disabled={disabled}
                    name="partitions"
                />
            </Partitions>
        </Section>
    )
}
