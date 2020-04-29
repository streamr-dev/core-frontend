// @flow

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Notification from '$shared/utils/Notification'
import DropdownActions from '$shared/components/DropdownActions'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import type { StreamId } from '$shared/flowtype/stream-types'
import Numeric from '$ui/Numeric'
import Label from '$ui/Label'
import ActionsDropdown from '$shared/components/ActionsDropdown'
import Text from '$ui/Text'
import SvgIcon from '$shared/components/SvgIcon'
import { docsLinks } from '$shared/../links'

import styles from './infoView.pcss'

type Props = {
    disabled: boolean,
}

const MIN_PARTITIONS = 1
const MAX_PARTITIONS = 99

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

    const { partitions } = stream

    const [partitionsValue, setPartitionsValue] = useState(String(partitions))
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const iconRef = useRef()
    const tooltipRef = useRef()

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(partitionsValue, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? partitions : numberValue
        numberValue = Math.max(MIN_PARTITIONS, Math.min(numberValue, MAX_PARTITIONS))
        setPartitionsValue(String(numberValue))
        editField('partitions', numberValue)
    }, [editField, partitions, partitionsValue])

    const onPartitionsChange = useCallback((event) => {
        setPartitionsValue(event.target.value)
    }, [setPartitionsValue])

    const openTooltip = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        e.stopPropagation()
        setTooltipOpen((isOpen) => !isOpen)
    }, [setTooltipOpen])

    useEffect(() => {
        if (!tooltipRef.current || !iconRef.current) { return }

        if (tooltipOpen) {
            const clickHandler = (e: SyntheticInputEvent<EventTarget>) => {
                e.preventDefault()
                e.stopPropagation()

                // $FlowFixMe Flow doesn't understand that tooltipRef and iconRef are defined
                if (tooltipOpen && !tooltipRef.current.contains(e.target) && !iconRef.current.contains(e.target)) {
                    setTooltipOpen(false)
                }
            }

            (document.addEventListener: Function)('mousedown', clickHandler, true)

            return () => {
                (document.addEventListener: Function)('mousedown', clickHandler, true)
            }
        }
    }, [tooltipOpen])

    return (
        <div className={cx('constrainInputWidth', styles.infoView)}>
            <div className={styles.name}>
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
            </div>
            <div className={styles.description}>
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
            </div>
            <div className={styles.streamId}>
                <Label htmlFor="streamId">
                    {I18n.t('userpages.streams.edit.details.streamId')}
                </Label>
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
                    />
                </ActionsDropdown>
            </div>
            <div className={styles.partitions}>
                <Label className={styles.partitionsLabel}>
                    {I18n.t('userpages.streams.partitionsLabel')}
                    <SvgIcon
                        name="outlineQuestionMark"
                        className={cx(styles.helpIcon, {
                            [styles.helpIconActive]: !disabled && tooltipOpen,
                        })}
                        onClick={openTooltip}
                        ref={iconRef}
                    />
                </Label>
                <Numeric
                    min={MIN_PARTITIONS}
                    max={MAX_PARTITIONS}
                    value={partitionsValue}
                    onChange={onPartitionsChange}
                    onBlur={onCommit}
                    disabled={disabled}
                />
                <div
                    className={cx(styles.tooltip, {
                        [styles.tooltipOpen]: !disabled && tooltipOpen,
                    })}
                    ref={tooltipRef}
                >
                    <Translate
                        value="userpages.streams.partitionsTooltip"
                        docsLink={docsLinks.partitioning}
                        dangerousHTML
                    />
                </div>
            </div>
        </div>
    )
}

function InfoViewMaybe(props: Props) {
    const stream = useSelector(selectEditedStream)

    // stream initially an empty object
    if (!stream || !Object.keys(stream).length) { return null }
    return <InfoView {...props} />
}

export default InfoViewMaybe
