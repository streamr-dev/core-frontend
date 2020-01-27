// @flow

import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Notification from '$shared/utils/Notification'
import DropdownActions from '$shared/components/DropdownActions'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import PartitionsView from '../PartitionsView'
import type { StreamId } from '$shared/flowtype/stream-types'
import FormControlLabel from '$shared/components/FormControlLabel'
import ActionsDropdown from '$shared/components/ActionsDropdown'
import Text from '$shared/components/Input/Text'

import styles from './infoView.pcss'

type Props = {
    disabled: boolean,
}

export const InfoView = ({ disabled }: Props) => {
    const stream = useSelector(selectEditedStream)
    const dispatch = useDispatch()
    const { copy } = useCopy()
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
        <div className={cx('constrainInputWidth', styles.infoView)}>
            <div className={styles.textInput}>
                <FormControlLabel htmlFor="streamName">
                    {I18n.t('userpages.streams.edit.details.name')}
                </FormControlLabel>
                <Text
                    id="streamName"
                    type="text"
                    name="name"
                    value={(stream && stream.name) || ''}
                    onChange={onNameChange}
                    disabled={disabled}
                    autoComplete="off"
                />
            </div>
            <div className={styles.textInput}>
                <FormControlLabel htmlFor="streamDescription">
                    {I18n.t('userpages.streams.edit.details.description')}
                </FormControlLabel>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
                    value={(stream && stream.description) || ''}
                    onChange={onDescriptionChange}
                    disabled={disabled}
                    autoComplete="off"
                />
            </div>
            <div className={styles.textInput}>
                <FormControlLabel htmlFor="streamId">
                    {I18n.t('userpages.streams.edit.details.streamId')}
                </FormControlLabel>
                <ActionsDropdown
                    actions={[
                        <DropdownActions.Item key="copy" onClick={() => onCopy(stream.id)}>
                            <Translate value="userpages.keyField.copy" />
                        </DropdownActions.Item>,
                    ]}
                >
                    <Text
                        name="id"
                        id="streamId"
                        value={(stream && stream.id) || ''}
                        readOnly
                        disabled={disabled}
                    />
                </ActionsDropdown>
            </div>
            <h5 className={styles.partitions}>{I18n.t('userpages.streams.edit.details.partitions')}</h5>
            <PartitionsView disabled={disabled} />
        </div>
    )
}

export default InfoView
