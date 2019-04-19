// @flow

import React, { useState, type Node, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { getUserData as getUserDataAction } from '$shared/modules/user/actions'
import AuthFormContext from '../../contexts/AuthForm'

type DispatchProps = {
    getUserData: () => void,
}

type Props = DispatchProps & {
    children?: Node,
    initialForm: Object,
    initialStep: number,
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getUserData: () => dispatch(getUserDataAction()),
})

const AuthFormProvider = ({ children, initialForm, getUserData: redirect, initialStep }: Props) => {
    const [errors, setErrors] = useState({})

    const [form, setForm] = useState(initialForm)

    const [step, setStep] = useState(initialStep)

    const [isProcessing, setIsProcessing] = useState(false)

    const next = useCallback(() => {
        setStep(step + 1)
    }, [step, setStep])

    const prev = useCallback(() => {
        setStep(Math.max(0, step - 1))
    }, [step, setStep])

    const setFieldError = useCallback((fieldName: string, message: string) => {
        const newErrors = {
            ...errors,
            [fieldName]: message,
        }
        if (!message) {
            delete newErrors[fieldName]
        }
        setErrors(newErrors)
    }, [errors, setErrors])

    const setFormField = useCallback((fieldName: string, value: any) => {
        setFieldError(fieldName, '')
        setForm({
            ...form,
            [fieldName]: value,
        })
    }, [setFieldError, setForm, form])

    const value = useMemo(() => ({
        errors,
        form,
        isProcessing,
        next,
        prev,
        redirect,
        setFieldError,
        setFormField,
        setIsProcessing,
        step,
    }), [errors, form, isProcessing, next, prev, redirect, setFieldError, setFormField, setIsProcessing, step])

    return (
        <AuthFormContext.Provider value={value}>
            {children}
        </AuthFormContext.Provider>
    )
}

export default connect(null, mapDispatchToProps)(AuthFormProvider)
