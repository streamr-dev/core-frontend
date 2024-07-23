import { StreamPermission } from '@streamr/sdk'
import React from 'react'
import styled from 'styled-components'
import Label from '~/shared/components/Ui/Label'
import TextInput from '~/shared/components/Ui/Text/StyledInput'
import { useCurrentStreamAbility } from '~/shared/stores/streamAbilities'
import { StreamDraft, getEmptyStreamEntity } from '~/stores/streamDraft'
import { Route as R } from '~/utils/routes'
import Section from '../Section'
import StorageNodeList from './StorageNodeList'

const Desc = styled.div`
    margin-bottom: 3.125rem;

    > p {
        margin: 0;
    }

    > p + p {
        margin-top: 0.5em;
    }
`

interface Props {
    disabled?: boolean
}

export function HistorySection({ disabled: disabledProp = false }: Props) {
    const {
        id: streamId,
        storage,
        metadata,
    } = StreamDraft.useEntity({ hot: true }) || getEmptyStreamEntity()

    const { storageDays } = metadata

    const canEdit = useCurrentStreamAbility(streamId, StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const noStorageEnabled = !Object.values(storage).some(Boolean)

    const update = StreamDraft.useUpdateEntity()

    return (
        <Section title="Data storage">
            <Desc>
                <p>
                    Enable data storage on your streams to retain historical messages and
                    access them later via a resend. Choose your storage provider and set
                    the duration for storing data before it is marked for deletion.
                </p>
                <p>
                    For more details, see the{' '}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={R.docs('/usage/streams/store-and-retrieve')}
                    >
                        docs
                    </a>
                    .
                </p>
            </Desc>
            <StorageNodeList disabled={disabled} />
            <Label htmlFor="storageAmount">Store historical data for (days)</Label>
            {/* @todo Bring back days/weeks/months selector. #chainid */}
            <TextFieldWrap>
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
            </TextFieldWrap>
        </Section>
    )
}

const TextFieldWrap = styled.div`
    width: 11rem;
`
