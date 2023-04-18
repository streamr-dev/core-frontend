import React from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Text from '$ui/Text'
import Label from '$ui/Label'
import Surround from '$shared/components/Surround'
import { useCurrentStreamAbility } from '$shared/stores/streamAbilities'
import { useCurrentDraft, useUpdateCurrentMetadata } from '$shared/stores/streamEditor'
import Section from '../Section'
import { ENS_DOMAINS_URL, ReadonlyStreamId, EditableStreamId } from './StreamId'

const Row = styled.div`
    & + & {
        margin-top: 2rem;
    }

    input[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`

export default function InfoSection({ disabled: disabledProp = false }) {
    const canEdit = useCurrentStreamAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const {
        streamId,
        metadata: { description = '' },
    } = useCurrentDraft()

    const updateMetadata = useUpdateCurrentMetadata()

    return (
        <Section title="Details">
            <Description>
                All streams have a unique id in the format{' '}
                <strong>domain/pathname</strong>.
                <Surround head=" " tail=" ">
                    The domain part can be your Ethereum address or an ENS name you own.
                </Surround>
                <Surround>
                    <a
                        href={ENS_DOMAINS_URL}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        Need an ENS name?
                    </a>
                </Surround>
            </Description>
            <Row>
                {streamId ? (
                    <ReadonlyStreamId streamId={streamId} />
                ) : (
                    <EditableStreamId disabled={disabled} />
                )}
            </Row>
            <Row>
                <Label htmlFor="streamDescription">Description</Label>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
                    placeholder="Add a brief description"
                    value={description}
                    onChange={({ target }) =>
                        void updateMetadata((metadata) => {
                            metadata.description = target.value || ''
                        })
                    }
                    disabled={disabled}
                    autoComplete="off"
                />
            </Row>
        </Section>
    )
}
