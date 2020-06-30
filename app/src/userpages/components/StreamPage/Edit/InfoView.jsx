// @flow

import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Notification from '$shared/utils/Notification'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import type { StreamId } from '$shared/flowtype/stream-types'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Button from '$shared/components/Button'

type Props = {
    disabled?: boolean,
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

const StyledButton = styled(Button)`
    && {
        padding: 0;
    }
`

export const InfoView = ({ disabled }: Props) => {
    const stream = useSelector(selectEditedStream)
    const dispatch = useDispatch()
    const { copy, isCopied } = useCopy()
    const contentChangedRef = useRef(false)
    const streamRef = useRef()
    streamRef.current = stream

    useEffect(() => {
        const handleBeforeunload = (event) => {
            if (contentChangedRef.current) {
                const message = I18n.t('userpages.streams.edit.details.unsavedChanges')
                const evt = (event || window.event)
                evt.returnValue = message // Gecko + IE
                return message // Webkit, Safari, Chrome etc.
            }
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeunload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload)
        }
    }, [contentChangedRef])

    const editField = useCallback((field: string, data: any) => {
        dispatch(updateEditStreamField(field, data))
    }, [dispatch])

    const onNameChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const name = e.target.value
        contentChangedRef.current = contentChangedRef.current || name !== (streamRef.current && streamRef.current.name)
        editField('name', name)
    }, [editField])

    const onDescriptionChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const description = e.target.value
        contentChangedRef.current = contentChangedRef.current || description !== (streamRef.current && streamRef.current.description)
        editField('description', description)
    }, [editField])

    const onCopy = useCallback((id: StreamId) => {
        copy(id)

        Notification.push({
            title: I18n.t('notifications.streamIdCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    return (
        <Root className="constrainInputWidth">
            <Row>
                <Label htmlFor="streamName">
                    {I18n.t('userpages.streams.edit.details.name')}
                </Label>
                <Text
                    id="streamName"
                    type="text"
                    name="name"
                    value={(stream && stream.name) || ''}
                    onChange={onNameChange}
                    disabled={disabled}
                    autoComplete="off"
                />
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
            <Row>
                <Label htmlFor="streamId">
                    {I18n.t('userpages.streams.edit.details.streamId')}
                </Label>
                <StreamInput>
                    <Text
                        name="id"
                        id="streamId"
                        value={(stream && stream.id) || ''}
                        readOnly
                    />
                    <StyledButton kind="secondary" onClick={() => onCopy(stream.id)}>
                        <Translate value={`userpages.keyField.${isCopied ? 'copied' : 'copy'}`} />
                    </StyledButton>
                </StreamInput>
            </Row>
        </Root>
    )
}

function InfoViewMaybe(props: Props) {
    const stream = useSelector(selectEditedStream)

    // stream initially an empty object
    if (!stream || !Object.keys(stream).length) { return null }
    return <InfoView {...props} />
}

export default InfoViewMaybe
