// @flow

import React, { useCallback } from 'react'
import styled from 'styled-components'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import type { StreamId, Stream } from '$shared/flowtype/stream-types'
import Label from '$ui/Label'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import getStreamPath from '$app/src/getters/getStreamPath'

import {
    StreamIdFormGroup,
    Field,
    Text,
} from '../shared/FormGroup'
import {
    ADD_DOMAIN_URL,
    PathnameTooltip,
} from '../New'

type Props = {
    stream: Stream,
    disabled?: boolean,
    updateStream?: Function,
}

const Root = styled.div``

const Row = styled.div`
    & + & {
        margin-top: 2rem;
    }
`

const StreamIdWrapper = styled.div`
    position: relative;
`

const StreamIdText = styled(Text)`
    padding: 0 3rem 0 1rem;
    text-overflow: ellipsis;
`

const LockIcon = styled.div`
    width: 40px;
    height: 40px;
    color: #989898;
    position: absolute;
    top: 0;
    line-height: 12px;
    right: 0;

    svg {
        width: 12px;
        height: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`

export const InfoView = ({ stream, disabled, updateStream }: Props) => {
    const { copy, isCopied } = useCopy()

    const { truncatedDomain: domain, pathname } = getStreamPath(stream.id)

    const onDescriptionChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const description = e.target.value

        if (typeof updateStream === 'function') {
            updateStream({ description })
        }
    }, [updateStream])

    const onCopy = useCallback((id: StreamId) => {
        copy(id)

        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    return (
        <Root>
            <Description>
                All streams require a unique path in the format <strong>domain/pathname</strong>.
                {' '}
                Your default domain will be an Ethereum address, but you can also use an existing ENS domain or
                {' '}
                <a href={ADD_DOMAIN_URL} target="_blank" rel="nofollow noopener noreferrer">
                    register a new one
                </a>.
            </Description>
            <Row>
                <StreamIdFormGroup hasDomain={!!domain} data-test-hook="StreamId">
                    {!!domain && (
                        <React.Fragment>
                            <Field
                                label="Domain"
                            >
                                <Text
                                    value={domain}
                                    readOnly
                                    name="domain"
                                />
                            </Field>
                            <Field narrow>
                                /
                            </Field>
                            <Field
                                label="Path name"
                            >
                                <StreamIdWrapper>
                                    <PathnameTooltip />
                                    <StreamIdText
                                        name="pathname"
                                        id="pathname"
                                        value={pathname}
                                        readOnly
                                    />
                                    <LockIcon>
                                        <SvgIcon name="lock" />
                                    </LockIcon>
                                </StreamIdWrapper>
                            </Field>
                        </React.Fragment>
                    )}
                    {!domain && (
                        <Field
                            label="Stream ID"
                        >
                            <StreamIdWrapper>
                                <StreamIdText
                                    name="streamId"
                                    id="streamId"
                                    value={pathname}
                                    readOnly
                                />
                                <LockIcon>
                                    <SvgIcon name="lock" />
                                </LockIcon>
                            </StreamIdWrapper>
                        </Field>
                    )}
                    <Field
                        narrow
                    >
                        <Button kind="secondary" onClick={() => onCopy(stream.id)}>
                            {!isCopied && 'Copy Stream ID'}
                            {!!isCopied && 'Copied!'}
                        </Button>
                    </Field>
                </StreamIdFormGroup>
            </Row>
            <Row>
                <Label htmlFor="streamDescription">
                    Description
                </Label>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
                    placeholder="Add a brief description"
                    value={(stream && stream.description) || ''}
                    onChange={onDescriptionChange}
                    disabled={disabled}
                    autoComplete="off"
                />
            </Row>
        </Root>
    )
}

export default InfoView
