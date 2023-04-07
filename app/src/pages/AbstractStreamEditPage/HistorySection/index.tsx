import React, { Fragment } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Label from '$ui/Label'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'
import { useCurrentAbility } from '$shared/stores/abilities'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import StorageNodeList from './StorageNodeList'
import { useCurrentDraft, useUpdateCurrentMetadata } from '../../../shared/stores/streamEditor'

function UnwrappedHistorySection({ disabled }) {
    const { metadata: { storageDays } } = useCurrentDraft()

    const updateMetadata = useUpdateCurrentMetadata()

    return (
        <Fragment>
            <Desc>
                Enable storage to retain historical data in one or more geographic locations of your choice. You can
                also choose how long to store your stream&apos;s historical data before auto-deletion.
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
                onChange={(value: number) => void updateMetadata((metadata) => {
                    metadata.storageDays = value
                })}
                quantity={storageDays}
            />
        </Fragment>
    )
}

const Desc = styled.p`
    /* @TODO: Isn't it the same as for PartitionsSection? -> normalize. */
    margin-bottom: 3.125rem;
`

export default function HistorySection({ disabled: disabledProp, ...props }) {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    return (
        <TOCSection disabled={disabled} id="historical-data" title="Data storage">
            {!isWithinNav && <UnwrappedHistorySection {...props} disabled={disabled} />}
        </TOCSection>
    )
}
