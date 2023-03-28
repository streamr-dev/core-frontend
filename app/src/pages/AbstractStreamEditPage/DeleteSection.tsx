import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'
import { useHistory } from 'react-router-dom'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import Button from '$shared/components/Button'
import useDecodedStreamId from '$shared/hooks/useDecodedStreamId'
import routes from '$routes'

const Description = styled.p`
    margin-bottom: 3rem;
`

const DeleteComponent = () => {
    const history = useHistory()
    const streamId = useDecodedStreamId()
    const client = useClient()
    const handleClick = useCallback(async () => {
        await client.deleteStream(streamId)
        history.push(routes.streams.index())
    }, [client, streamId, history])
    return (
        <>
            <Description>Delete this stream forever. You can&apos;t undo this.</Description>
            <Button
                kind='destructive'
                onClick={handleClick}
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
