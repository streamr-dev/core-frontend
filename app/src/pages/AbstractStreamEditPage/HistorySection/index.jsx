import React from 'react'
import styled from 'styled-components'
import TOCPage from '$shared/components/TOCPage'
import Label from '$ui/Label'
import useStreamId from '$shared/hooks/useStreamId'
import useStream from '$shared/hooks/useStream'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import StorageNodeList from './StorageNodeList'

const defaultDesc = (
    <p>
        Enable storage to retain historical data in one or more geographic locations of your choice.
        {' '}
        You can also choose how long to store your stream&apos;s historical data before auto-deletion.
    </p>
)

function UnstyledHistorySection({ className, disabled = false, desc = defaultDesc }) {
    const streamId = useStreamId()

    const stream = useStream()

    const { stage } = useStreamModifier()

    const { storageDays } = stream || {}

    return (
        <TOCPage.Section
            disabled={disabled}
            id="historical-data"
            title="Data storage"
        >
            <div className={className}>
                {desc}
                {!!streamId && (
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
