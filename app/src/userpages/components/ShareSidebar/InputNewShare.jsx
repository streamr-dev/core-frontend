import React, { useState, useCallback, useRef, useEffect } from 'react'
import { I18n } from 'react-redux-i18n'
import useUniqueId from '$shared/hooks/useUniqueId'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import TextInput from '$ui/Text'
import Errors from '$ui/Errors'
import * as State from './state'
import styles from './ShareSidebar.pcss'

/**
 * Input for adding new users.
 */

export default function InputNewShare({ currentUser, onChange, canShareToUser }) {
    const [value, setValue] = useState('')
    const onChangeValue = useCallback((e) => {
        setValue(e.target.value.trim())
    }, [setValue])
    const onAdd = useCallback(() => {
        onChange(value)
        setValue('')
    }, [value, onChange])

    const uid = useUniqueId('InputNewShare')

    function getShareToUserError({ currentUser, userId }) {
        if (!State.isValidUserId(userId)) { return I18n.t('share.error.invalidUserError') }
        if (userId === 'anonymous') { return I18n.t('share.error.anonymousUserError') }
        if (userId === currentUser) { return I18n.t('share.error.currentUserError') }
    }

    const error = getShareToUserError({
        currentUser,
        userId: value,
    })

    const isValid = canShareToUser(value)
    const [trySubmit, setTrySubmit] = useState(false)

    // only show validation when not focussed
    const [shouldShowValidation, setShouldShowValidation] = useState(false)
    const onBlur = useCallback(() => {
        setShouldShowValidation(true)
    }, [])

    const onFocus = useCallback(() => {
        setTrySubmit(false)
        setShouldShowValidation(false)
    }, [])

    const onKeyDown = useCallback((event) => {
        // try add user on enter
        if (event.key === 'Enter') {
            setTrySubmit(true)
        } else {
            setTrySubmit(false)
            setShouldShowValidation(false)
        }
    }, [])

    // only add user on enter if valid
    const shouldTrySubmit = !!(value && isValid && trySubmit)
    const onAddRef = useRef()
    onAddRef.current = onAdd
    // trigger onAdd in effect so value/validity state has chance to update
    useEffect(() => {
        if (!shouldTrySubmit) { return }
        onAddRef.current()
        setTrySubmit(false)
    }, [shouldTrySubmit, onAddRef])

    const showValidationError = shouldShowValidation && value && !isValid

    return (
        <div className={styles.InputNewShare}>
            <label htmlFor={uid}>{I18n.t('auth.labels.address')}</label>
            <TextInput
                id={uid}
                className={styles.input}
                placeholder={I18n.t('modal.shareResource.enterEmailAddress')}
                value={value}
                onChange={onChangeValue}
                onFocus={onFocus}
                onBlur={onBlur}
                autoComplete="email"
                invalid={showValidationError}
                onKeyDown={onKeyDown}
            />
            <Button
                kind="secondary"
                onClick={onAdd}
                disabled={!isValid}
                className={styles.button}
            >
                <SvgIcon name="plus" className={styles.plusIcon} />
            </Button>
            {showValidationError && <Errors>{error}</Errors>}
        </div>
    )
}
