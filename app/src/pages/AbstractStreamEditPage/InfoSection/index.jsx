import React from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import TOCPage from '$shared/components/TOCPage'
import Text from '$ui/Text'
import useStreamId from '$shared/hooks/useStreamId'
import useStream from '$shared/hooks/useStream'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import Label from '$ui/Label'
import Surround from '$shared/components/Surround'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { ENS_DOMAINS_URL, ReadonlyStreamId, EditableStreamId } from './StreamId'

function DefaultDescription() {
    const streamId = useStreamId()

    return (
        <Description>
            All streams require a unique path in the format <strong>domain/pathname</strong>.
            <Surround head=" " tail=" ">
                Your default domain will be an Ethereum address, but you can also use an existing ENS domain or
            </Surround>
            <Surround tail=".">
                <a href={ENS_DOMAINS_URL} target="_blank" rel="nofollow noopener noreferrer">
                    register a new one
                </a>
            </Surround>
            {!streamId && (
                <Surround head=" ">
                    Choose your stream name &amp; create it in order to adjust stream settings.
                </Surround>
            )}
        </Description>
    )
}

function UnstyledInfoSection({ className, desc = <DefaultDescription />, disabled: disabledProp = false, hideDescription = false }) {
    const streamId = useStreamId()

    const stream = useStream()

    const StreamIdComponent = streamId ? ReadonlyStreamId : EditableStreamId

    const { description = '' } = stream || {}

    const { stage } = useStreamModifier()

    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()

    const disabled = disabledProp || !canEdit

    return (
        <TOCPage.Section
            id="details"
            title="Details"
        >
            <div className={className}>
                {desc}
                <Row>
                    <StreamIdComponent disabled={disabled} />
                </Row>
                {!hideDescription && (
                    <Row>
                        <Label htmlFor="streamDescription">
                            Description
                        </Label>
                        <Text
                            type="text"
                            id="streamDescription"
                            name="description"
                            placeholder="Add a brief description"
                            value={description}
                            onChange={({ target }) => void stage({
                                description: target.value || '',
                            })}
                            disabled={disabled}
                            autoComplete="off"
                        />
                    </Row>
                )}
            </div>
        </TOCPage.Section>
    )
}

const Row = styled.div`
    & + & {
        margin-top: 2rem;
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`

const InfoSection = styled(UnstyledInfoSection)`
    input[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }
`

export default InfoSection
