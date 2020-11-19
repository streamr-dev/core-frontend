// @flow

import React, { useCallback, useMemo } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import type { StreamId, Stream } from '$shared/flowtype/stream-types'
import Label from '$ui/Label'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'

import {
    StreamIdFormGroup,
    Field,
    Text,
} from '../View'
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

const Description = styled(Translate)`
    margin-bottom: 3rem;
`

export const InfoView = ({ stream, disabled, updateStream }: Props) => {
    const { copy, isCopied } = useCopy()
    const streamId = (stream && stream.id) || ''

    const [domain, pathname] = useMemo(() => {
        const firstSlashPos = streamId.indexOf('/')

        if (firstSlashPos < 0) {
            return [undefined, streamId]
        }

        return [
            streamId.slice(0, firstSlashPos),
            streamId.slice(firstSlashPos + 1),
        ]
    }, [streamId])

    const onDescriptionChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const description = e.target.value

        if (typeof updateStream === 'function') {
            updateStream({ description })
        }
    }, [updateStream])

    const onCopy = useCallback((id: StreamId) => {
        copy(id)

        Notification.push({
            title: I18n.t('notifications.streamIdCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    return (
        <Root>
            <Description
                value="userpages.streams.edit.details.info.description"
                tag="p"
                addDomainUrl={ADD_DOMAIN_URL}
                dangerousHTML
            />
            <Row>
                <StreamIdFormGroup hasDomain={!!domain}>
                    {!!domain && (
                        <React.Fragment>
                            <Field
                                label={I18n.t('userpages.streams.edit.details.domain.label')}
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
                                label={I18n.t('userpages.streams.edit.details.pathname.label')}
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
                            label={I18n.t('userpages.streams.edit.details.streamId')}
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
                            <Translate value={`userpages.streams.edit.details.${isCopied ? 'streamIdCopied' : 'copyStreamId'}`} />
                        </Button>
                    </Field>
                </StreamIdFormGroup>
            </Row>
            <Row>
                <Label htmlFor="streamDescription">
                    {I18n.t('userpages.streams.edit.details.description.label')}
                </Label>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
                    placeholder={I18n.t('userpages.streams.edit.details.description.placeholder')}
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
