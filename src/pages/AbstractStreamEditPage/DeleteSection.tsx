import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Button from '~/shared/components/Button'
import getTransactionalClient from '~/getters/getTransactionalClient'
import { useCurrentDraft } from '~/shared/stores/streamEditor'
import routes from '~/routes'
import Section from './Section'

const Description = styled.p`
    margin-bottom: 3rem;
`

export default function DeleteSection() {
    const navigate = useNavigate()

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
                    navigate(routes.streams.index())
                }}
            >
                Delete
            </Button>
        </Section>
    )
}
