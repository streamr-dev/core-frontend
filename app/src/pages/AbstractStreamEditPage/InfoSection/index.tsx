import React, { Fragment } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Text from '$ui/Text'
import useStreamId from '$shared/hooks/useStreamId'
import { useTransientStream } from '$shared/contexts/TransientStreamContext'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import Label from '$ui/Label'
import Surround from '$shared/components/Surround'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import { ENS_DOMAINS_URL, ReadonlyStreamId, EditableStreamId } from './StreamId'

function UnwrappedInfoSection({ disabled, canEdit }) {
    const streamId = useStreamId()
    const StreamIdComponent = streamId ? ReadonlyStreamId : EditableStreamId
    const { metadata } = useTransientStream()
    const { description = '' } = metadata || {}

    const { stage } = useStreamModifier()
    return (
        <Fragment>
            <Description>
                All streams have a unique id in the format <strong>domain/pathname</strong>.
                <Surround head=" " tail=" ">
                    The domain part can be your Ethereum address or an ENS name you own.
                </Surround>
                <Surround>
                    <a href={ENS_DOMAINS_URL} target="_blank" rel="nofollow noopener noreferrer">
                        Need an ENS name?
                    </a>
                </Surround>
            </Description>
            <Row>
                <StreamIdComponent disabled={disabled} />
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
                        void stage({
                            metadata: {
                                description: target.value || '',
                            },
                        })
                    }
                    disabled={disabled}
                    autoComplete="off"
                />
            </Row>
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
        <TOCSection id="details" title="Details">
            {!isWithinNav && <UnwrappedInfoSection {...props} canEdit={canEdit} disabled={disabled} />}
        </TOCSection>
    )
}
