import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Button from '$shared/components/Button'
import getTransactionalClient from '$app/src/getters/getTransactionalClient'
import { useCurrentDraft } from '$shared/stores/streamEditor'
import routes from '$routes'
import Section from './Section'

const Description = styled.p`
    margin-bottom: 3rem;
`

export default function DeleteSection() {
    const history = useHistory()

    const { streamId } = useCurrentDraft()

    return (
        <Section title="Delete stream">
            <Description>
                Delete this stream forever. You can&apos;t undo this.
            </Description>
            <Button
                type="button"
                kind="destructive"
                disabled={!streamId}
                onClick={async () => {
                    if (!streamId) {
                        return
                    }

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
        </Section>
    )
}
