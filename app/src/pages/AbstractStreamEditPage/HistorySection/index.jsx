import React from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import TOCPage from '$shared/components/TOCPage'
import Label from '$ui/Label'
import useStreamId from '$shared/hooks/useStreamId'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import StorageNodeList from './StorageNodeList'

function UnstyledHistorySection({ className, disabled: disabledProp = false }) {
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()

    const disabled = disabledProp || !canEdit

    const streamId = useStreamId()

    const { stage } = useStreamModifier()

    const { storageDays } = useTransientStream()

    const canAssignStorageNodes = !!streamId && !!canEdit

    return (
        <TOCPage.Section
            disabled={disabled}
            id="historical-data"
            title="Data storage"
        >
            <div className={className}>
                {!!canEdit && (
                    <p>
                        Enable storage to retain historical data in one or more geographic locations of your choice.
                        {' '}
                        You can also choose how long to store your stream&apos;s historical data before auto-deletion.
                    </p>
                )}
                {canAssignStorageNodes && (
                    <StorageNodeList />
                )}
                <Label htmlFor="storageAmount">
                    Store historical data for
                </Label>
                <UnitizedQuantity
                    units={{
                        day: 1,
                        month: 30,
                        week: 7,
                    }}
                    disabled={disabled}
                    onChange={(value) => void stage({
                        storageDays: value,
                    })}
                    quantity={storageDays}
                />
            </div>
        </TOCPage.Section>
    )
}

const HistorySection = styled(UnstyledHistorySection)`
    > p {
        /* @TODO: Isn't it the same as for PartitionsSection? -> normalize. */
        margin-bottom: 3.125rem;
    }
`

export default HistorySection
