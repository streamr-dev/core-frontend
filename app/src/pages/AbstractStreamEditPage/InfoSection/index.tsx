import React, { Fragment } from 'react'
import { StreamPermission } from 'streamr-client'
import styled from 'styled-components'
import Text from '$ui/Text'
import Label from '$ui/Label'
import Surround from '$shared/components/Surround'
import { useCurrentAbility } from '$shared/stores/abilities'
import { useIsWithinNav } from '$shared/components/TOCPage/TOCNavContext'
import TOCSection from '$shared/components/TOCPage/TOCSection'
import { useCurrentDraft, useUpdateCurrentMetadata } from '$shared/stores/streamEditor'
import { ENS_DOMAINS_URL, ReadonlyStreamId, EditableStreamId } from './StreamId'

function UnwrappedInfoSection({ disabled }) {
    const { streamId, metadata: { description = '' } } = useCurrentDraft()

    const updateMetadata = useUpdateCurrentMetadata()

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
                {streamId ? <ReadonlyStreamId streamId={streamId} /> : <EditableStreamId disabled={disabled} />}
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
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const isWithinNav = useIsWithinNav()

    return (
        <TOCSection id="details" title="Details">
            {!isWithinNav && <UnwrappedInfoSection {...props} disabled={disabled} />}
        </TOCSection>
    )
}
