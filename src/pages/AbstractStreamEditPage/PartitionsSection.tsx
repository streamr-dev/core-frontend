import React from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import { z } from 'zod'
import { Advanced } from '~/shared/components/StatusLabel'
import Label from '~/shared/components/Ui/Label'
import TextInput from '~/shared/components/Ui/Text/StyledInput'
import { useCurrentStreamAbility } from '~/shared/stores/streamAbilities'
import { StreamDraft, getEmptyStreamEntity } from '~/stores/streamDraft'
import Section from './Section'

export function PartitionsSection({ disabled: disabledProp = false }) {
    const { id: streamId, metadata } =
        StreamDraft.useEntity({ hot: true }) || getEmptyStreamEntity()

    const canEdit = useCurrentStreamAbility(streamId, StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const { partitions } = metadata

    const update = StreamDraft.useUpdateEntity()

    return (
        <Section title="Stream partitions" status={<Advanced />}>
            <Desc>
                Partitioning enables high-volume streams to scale beyond what a typical
                node can handle. If you&apos;re not sure if your stream needs partitions,
                leave it set to 1.
            </Desc>
            <Partitions>
                <Label>Partitions</Label>
                <TextInput
                    type="number"
                    min={PartitionRange.Min}
                    max={PartitionRange.Max}
                    step={1}
                    value={partitions}
                    onChange={(e) => {
                        update((hot) => {
                            hot.metadata.partitions = e.target.value
                        })
                    }}
                    onBlur={() => {
                        update((hot, cold) => {
                            const valid = z.coerce
                                .number()
                                .min(PartitionRange.Min)
                                .max(PartitionRange.Max)
                                .safeParse(partitions).success

                            if (valid) {
                                return
                            }

                            hot.metadata.partitions = cold.metadata.partitions
                        })
                    }}
                    disabled={disabled}
                />
            </Partitions>
        </Section>
    )
}

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
