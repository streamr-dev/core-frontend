// @flow

import React, { useCallback } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import type { StreamId, Stream } from '$shared/flowtype/stream-types'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'

type Props = {
    stream: Stream,
    disabled?: boolean,
    updateStream?: Function,
}

const Root = styled.div``

const Row = styled.div`
    max-width: 602px;

    & + & {
        margin-top: 2rem;
    }
`

const StreamInput = styled.div`
    display: grid;
    grid-column-gap: 1rem;
    grid-template-columns: 1fr 72px;
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

const StyledButton = styled(Button)`
    && {
        padding: 0;
    }
`

const Description = styled(Translate)`
    margin-bottom: 3rem;
`

export const InfoView = ({ stream, disabled, updateStream }: Props) => {
    const { copy, isCopied } = useCopy()

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
                defaultDomain="sandbox"
                dangerousHTML
            />
            <Row>
                <Label htmlFor="streamId">
                    {I18n.t('userpages.streams.edit.details.streamId')}
                </Label>
                <StreamInput>
                    <StreamIdWrapper>
                        <StreamIdText
                            name="id"
                            id="streamId"
                            value={(stream && stream.id) || ''}
                            readOnly
                        />
                        <LockIcon>
                            <SvgIcon name="lock" />
                        </LockIcon>
                    </StreamIdWrapper>
                    <StyledButton kind="secondary" onClick={() => onCopy(stream.id)}>
                        <Translate value={`userpages.keyField.${isCopied ? 'copied' : 'copy'}`} />
                    </StyledButton>
                </StreamInput>
            </Row>
            <Row>
                <Label htmlFor="streamDescription">
                    {I18n.t('userpages.streams.edit.details.description')}
                </Label>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
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
