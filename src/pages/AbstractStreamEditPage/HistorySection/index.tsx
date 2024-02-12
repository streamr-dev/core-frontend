import React from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Label from '~/shared/components/Ui/Label'
import TextInput from '~/shared/components/Ui/Text/StyledInput'
import { useCurrentStreamAbility2 } from '~/shared/stores/streamAbilities'
import { StreamDraft, getEmptyStreamEntity } from '~/stores/streamDraft'
import Section from '../Section'
import StorageNodeList from './StorageNodeList'

const Desc = styled.p`
    /* @TODO: Isn't it the same as for PartitionsSection? -> normalize. */
    margin-bottom: 3.125rem;
`

interface Props {
    disabled?: boolean
}

export default function HistorySection({ disabled: disabledProp = false }: Props) {
    const {
        id: streamId,
        storage,
        metadata,
    } = StreamDraft.useEntity({ hot: true }) || getEmptyStreamEntity()

    const { storageDays } = metadata

    const canEdit = useCurrentStreamAbility2(streamId, StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const noStorageEnabled = !Object.values(storage).some(Boolean)

    const update = StreamDraft.useUpdateEntity()

    return (
        <Section title="Data storage">
            <Desc>
                Enable storage to retain historical data in one or more geographic
                locations of your choice. You can also choose how long to store your
                stream&apos;s historical data before auto-deletion.
            </Desc>
            <StorageNodeList disabled={disabled} />
            <Label htmlFor="storageAmount">Store historical data for</Label>
            {/* @todo Bring back days/weeks/months selector. #chainid */}
            <TextInput
                disabled={disabled || noStorageEnabled}
                type="number"
                step={1}
                min={1}
                value={storageDays}
                onChange={(e) => {
                    update((hot) => {
                        hot.metadata.storageDays = e.target.value
                    })
                }}
            />
        </Section>
    )
}
