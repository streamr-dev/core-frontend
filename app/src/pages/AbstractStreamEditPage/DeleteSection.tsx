import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import Button from '$shared/components/Button'
import useDecodedStreamId from '$shared/hooks/useDecodedStreamId'
import getTransactionalClient from '$app/src/getters/getTransactionalClient'
import routes from '$routes'

const Description = styled.p`
    margin-bottom: 3rem;
`

const DeleteComponent = () => {
    const history = useHistory()
    const streamId = useDecodedStreamId()

    return (
        <>
            <Description>Delete this stream forever. You can&apos;t undo this.</Description>
            <Button
                type="button"
                kind='destructive'
                onClick={async () => {
                    const client = await getTransactionalClient()

                    await client.deleteStream(streamId)

                    /**
                     * @FIXME: If the user navigates away before the above transaciton is
                     * done the app is gonna navigate to streams/index.
                     */
                    history.push(routes.streams.index())
                }}
            >
                Delete
            </Button>
        </>
    )
}

const DeleteSection = () => {
    const isWithinNav = useIsWithinNav()
    return (
        <TOCSection id="delete" title="Delete stream">
            {!isWithinNav && (
                <DeleteComponent />
            )}
        </TOCSection>
    )
}

export default DeleteSection
