import React, { Fragment } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import TOCPage from '$shared/components/TOCPage'
import Text from '$ui/Text'
import useStreamId from '$shared/hooks/useStreamId'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import Label from '$ui/Label'
import Surround from '$shared/components/Surround'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import { ENS_DOMAINS_URL, ReadonlyStreamId, EditableStreamId } from './StreamId'

function UnwrappedInfoSection({ disabled, canEdit }) {
    const streamId = useStreamId()

    const StreamIdComponent = streamId ? ReadonlyStreamId : EditableStreamId

    const { description = '' } = useTransientStream()

    const { stage } = useStreamModifier()

    return (
        <Fragment>
            {!!canEdit && (
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
            )}
            <Row>
                <StreamIdComponent disabled={disabled} />
            </Row>
            {!!(canEdit || description) && (
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
        </Fragment>
    )
}

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

export default function InfoSection({ disabled: disabledProp, ...props }) {
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    return (
        <TOCPage.Section
            id="details"
            title="Details"
        >
            {!isWithinNav && (
                <UnwrappedInfoSection
                    {...props}
                    canEdit={canEdit}
                    disabled={disabled}
                />
            )}
        </TOCPage.Section>
    )
}
