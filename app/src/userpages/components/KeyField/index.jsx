// @flow

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import TextInput from '$shared/components/TextInput'
import DropdownActions from '$shared/components/DropdownActions'
import { truncate } from '$shared/utils/text'
import KeyFieldEditor, { type ValueLabel } from './KeyFieldEditor'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useIsMounted from '$shared/hooks/useIsMounted'
import useCopy from '$shared/hooks/useCopy'

import styles from './keyField.pcss'

type Props = {
    keyName: string,
    value?: string,
    hideValue?: boolean,
    truncateValue?: boolean,
    className?: string,
    keyFieldClassName?: string,
    allowEdit?: boolean,
    onSave?: (?string, ?string) => Promise<void>,
    allowDelete?: boolean,
    disableDelete?: boolean,
    onDelete?: () => Promise<void>,
    valueLabel: ValueLabel,
    onToggleEditor?: (boolean) => void,
}

const includeIf = (condition: boolean, elements: Array<any>) => (condition ? elements : [])

const KeyField = ({
    keyName,
    value,
    hideValue,
    truncateValue,
    className,
    keyFieldClassName,
    allowEdit,
    onSave: onSaveProp,
    allowDelete,
    disableDelete,
    onDelete: onDeleteProp,
    valueLabel = 'apiKey',
    onToggleEditor: onToggleEditorProp,
}: Props) => {
    const [waiting, setWaiting] = useState(false)
    const [hidden, setHidden] = useState(!!hideValue)
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState(undefined)

    const isMounted = useIsMounted()
    const { copy } = useCopy()

    const toggleHidden = useCallback(() => {
        setHidden((wasHidden) => !wasHidden)
    }, [])

    useEffect(() => {
        if (onToggleEditorProp) {
            onToggleEditorProp(editing)
        }
    }, [editing, onToggleEditorProp])

    const notify = useCallback(() => {
        Notification.push({
            title: I18n.t('notifications.valueCopied', {
                value: I18n.t(`userpages.keyFieldEditor.keyValue.${valueLabel}`),
            }),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [valueLabel])

    const onCopy = useCallback(() => {
        copy(value || '')
        notify()
    }, [copy, value, notify])

    const onCancel = useCallback(() => {
        setEditing(false)
    }, [])

    const onSave = useCallback(async (keyName: ?string, value: ?string) => {
        if (allowEdit) {
            setError(undefined)

            if (onSaveProp) {
                setWaiting(true)

                try {
                    await onSaveProp(keyName, value)

                    if (isMounted()) {
                        setEditing(false)
                        setError(undefined)
                    }
                } catch (e) {
                    if (isMounted()) {
                        setError(undefined)
                    }
                } finally {
                    setWaiting(false)
                }
            } else {
                setEditing(false)
            }
        }
    }, [allowEdit, onSaveProp, isMounted])

    const onDelete = useCallback(() => {
        if (allowDelete && onDeleteProp) {
            onDeleteProp()
        }
    }, [allowDelete, onDeleteProp])

    const onEdit = useCallback(() => {
        setEditing(true)
    }, [])

    const revealAction = useMemo(() => (
        <DropdownActions.Item key="reveal" onClick={toggleHidden}>
            <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'conceal'}`} />
        </DropdownActions.Item>
    ), [toggleHidden, hidden])

    const editAction = useMemo(() => (
        <DropdownActions.Item key="edit" onClick={onEdit}>
            <Translate value="userpages.keyField.edit" />
        </DropdownActions.Item>
    ), [onEdit])

    const deleteAction = useMemo(() => (
        <DropdownActions.Item key="delete" onClick={onDelete} disabled={disableDelete}>
            <Translate value="userpages.keyField.delete" />
        </DropdownActions.Item>
    ), [onDelete, disableDelete])

    const inputActions = useMemo(() => ([
        ...includeIf(!!hideValue, [revealAction]),
        <DropdownActions.Item key="copy" onClick={onCopy}>
            <Translate value="userpages.keyField.copy" />
        </DropdownActions.Item>,
        ...includeIf(!!allowEdit, [editAction]),
        ...includeIf(!!allowDelete, [deleteAction]),
    ]), [hideValue, revealAction, onCopy, allowEdit, editAction, allowDelete, deleteAction])

    const displayValue = useMemo(() => (
        value && (!truncateValue ? value : truncate(value, {
            maxLength: 15,
        }))
    ), [truncateValue, value])

    return (
        <div className={cx(styles.root, styles.KeyField, className)}>
            {!editing ? (
                <div
                    className={cx(styles.keyFieldContainer, keyFieldClassName)}
                >
                    <TextInput
                        label={keyName}
                        actions={inputActions}
                        value={displayValue}
                        readOnly
                        type={hidden ? 'password' : 'text'}
                        preserveLabelSpace
                    />
                </div>
            ) : (
                <KeyFieldEditor
                    keyName={keyName}
                    value={value}
                    onCancel={onCancel}
                    onSave={onSave}
                    waiting={waiting}
                    error={error}
                    valueLabel={valueLabel}
                />
            )}
        </div>
    )
}

export default KeyField
