import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import useUniqueId from '$shared/hooks/useUniqueId'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import canShareToUserId from '$shared/utils/sharing/canShareToUserId'
import isValidUserId from '$shared/utils/sharing/isValidUserId'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Errors from '$ui/Errors'
import { usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import { ADD_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import address0 from '$utils/address0'

const Inner = styled.div`
    display: grid;
    grid-column-gap: 16px;
    grid-template-columns: 1fr auto;
`

const UnstyledNewShareForm = ({ className, onAdd }) => {
    const [value, setValue] = useState('')

    const [focused, setFocused] = useState(false)

    const [showErrorsImmediately, setShowErrorsImmediately] = useState(false)

    const validationError = (() => {
        if (!isValidUserId(value)) { return 'Invalid User ID' }
        if (value.toLowerCase() === address0) { return 'Can not share to anonymous' }
    })()

    const dispatch = usePermissionsDispatch()

    const onSubmit = useCallback((e) => {
        e.preventDefault()

        if (validationError) {
            return
        }

        dispatch({
            type: ADD_PERMISSION,
            user: value,
        })

        if (typeof onAdd === 'function') {
            onAdd(value)
        }

        setValue('')
    }, [value, validationError, dispatch, onAdd])

    const onChange = useCallback((e) => {
        setValue(e.target.value)
        setShowErrorsImmediately(false)
    }, [])

    const onFocus = useCallback(() => {
        setFocused(true)
    }, [])

    const onBlur = useCallback(() => {
        setFocused(false)
        setShowErrorsImmediately(false)
    }, [])

    const onKeyDown = useCallback(({ key }) => {
        if (key === 'Enter' && validationError) {
            // Invalid values prevent Enter key from submitting the form. That's why the following
            // is here and not in `onSubmit`.
            setShowErrorsImmediately(true)
        }
    }, [validationError])

    const isValid = canShareToUserId(value)

    const uid = useUniqueId('InputNewShare')

    const showValidationError = (showErrorsImmediately || (!focused && !!value)) && !!validationError

    return (
        <form className={className} onSubmit={onSubmit}>
            <Label htmlFor={uid}>
                User ID
            </Label>
            <Inner>
                <Text
                    autoComplete="email"
                    id={uid}
                    invalid={showValidationError}
                    onBlur={onBlur}
                    onChange={onChange}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    placeholder="Enter email or Ethereum address"
                    value={value}
                />
                <Button
                    disabled={!isValid}
                    kind="secondary"
                    type="submit"
                >
                    <SvgIcon name="plus" />
                </Button>
                {showValidationError && (
                    <Errors>{validationError}</Errors>
                )}
            </Inner>
        </form>
    )
}

const NewShareForm = styled(UnstyledNewShareForm)`
    input {
        background-color: #fdfdfd;
        font-size: 14px;
        line-height: normal;
    }

    button {
        height: 40px;
        padding: 0;
        width: 40px;
    }

    svg {
        display: block;
        height: 16px;
        width: 16px;
    }
`

export default NewShareForm
