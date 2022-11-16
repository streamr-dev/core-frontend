import React, { Fragment } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Label from '$ui/Label'
import useStreamId from '$shared/hooks/useStreamId'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import UnitizedQuantity from '$shared/components/UnitizedQuantity'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import StorageNodeList from './StorageNodeList'

function UnwrappedHistorySection({ disabled, canEdit }) {
    const streamId = useStreamId()
    const { stage } = useStreamModifier()
    const { metadata } = useTransientStream()
    const { storageDays } = metadata || {}
    const canAssignStorageNodes = !!streamId && !!canEdit
    return (
        <Fragment>
            {!!canEdit && (
                <Desc>
                    Enable storage to retain historical data in one or more geographic locations of your choice. You can
                    also choose how long to store your stream&apos;s historical data before auto-deletion.
                </Desc>
            )}
            {canAssignStorageNodes && <StorageNodeList />}
            <Label htmlFor="storageAmount">Store historical data for</Label>
            <UnitizedQuantity
                units={{
                    day: 1,
                    month: 30,
                    week: 7,
                }}
                disabled={disabled}
                onChange={(value) =>
                    void stage({
                        metadata: {
                            storageDays: value,
                        },
                    })
                }
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
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()
    const disabled = disabledProp || !canEdit
    const isWithinNav = useIsWithinNav()
    return (
        <TOCSection disabled={disabled} id="historical-data" title="Data storage">
            {!isWithinNav && <UnwrappedHistorySection {...props} disabled={disabled} canEdit={canEdit} />}
        </TOCSection>
    )
}
