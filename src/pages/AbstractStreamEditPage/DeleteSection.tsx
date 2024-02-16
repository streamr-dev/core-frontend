import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import { getStreamrClientInstance } from '~/getters/getStreamrClient'
import { isRejectionReason, isTransactionRejection } from '~/utils/exceptions'
import routes from '~/routes'
import { useCurrentChainId } from '~/shared/stores/chain'
import { StreamDraft } from '~/stores/streamDraft'
import Section from './Section'

const Description = styled.p`
    margin-bottom: 3rem;
`

export default function DeleteSection() {
    const navigate = useNavigate()

    const { id: streamId } = StreamDraft.useEntity() || {}

    const chainId = useCurrentChainId()

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

                    try {
                        const client = await getStreamrClientInstance(chainId, {
                            transactional: true,
                        })

                        await client.deleteStream(streamId)

                        /**
                         * @FIXME: If the user navigates away before the above transaciton is
                         * done the app is gonna navigate to streams/index.
                         */

                        navigate(routes.streams.index())
                    } catch (e) {
                        if (isRejectionReason(e)) {
                            return
                        }

                        if (isTransactionRejection(e)) {
                            return
                        }

                        throw e
                    }
                }}
            >
                Delete
            </Button>
        </Section>
    )
}
