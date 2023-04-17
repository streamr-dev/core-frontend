import React, { Fragment } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Label from '$ui/Label'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'
import { useCurrentAbility } from '$shared/stores/abilities'
import { useCurrentDraft, useUpdateCurrentMetadata } from '$shared/stores/streamEditor'
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
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const {
        metadata: { storageDays },
    } = useCurrentDraft()

    const updateMetadata = useUpdateCurrentMetadata()

    return (
        <Section title="Data storage">
            <Desc>
                Enable storage to retain historical data in one or more geographic
                locations of your choice. You can also choose how long to store your
                stream&apos;s historical data before auto-deletion.
            </Desc>
            <StorageNodeList disabled={disabled} />
            <Label htmlFor="storageAmount">Store historical data for</Label>
            <UnitizedQuantity
                units={{
                    day: 1,
                    month: 30,
                    week: 7,
                }}
                disabled={disabled}
                onChange={(value: number) =>
                    void updateMetadata((metadata) => {
                        metadata.storageDays = value
                    })
                }
                quantity={storageDays}
            />
        </Section>
    )
}
