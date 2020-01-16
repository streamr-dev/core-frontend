// @flow

import React, { useContext, useCallback } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'

import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import AuthPanel from '../AuthPanel'
import TextInput from '../TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import schemas from '../../schemas/forgotPassword'
import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import routes from '$routes'

type Props = {}

type Form = {
    email: string,
}

const initialForm: Form = {
    email: '',
}

const ForgotPasswordPage = () => {
    const {
        errors,
        form,
        isProcessing,
        setFieldError,
        setFormField,
        step,
    } = useContext(AuthFormContext)

    const onFailure = useCallback(({ message }: Error) => {
        setFieldError('email', message)
    }, [setFieldError])

    const submit = useCallback(() => {
        const { email: username } = form

        return post(routes.externalForgotPassword(), {
            username,
        }, false, true)
    }, [form])

    return (
        <AuthLayout>
            <AuthPanel
                validationSchemas={schemas}
                onValidationError={setFieldError}
            >
                <AuthStep
                    title={I18n.t('auth.forgotPassword.link.get')}
                    onSubmit={submit}
                    onFailure={onFailure}
                    showSignin
                >
                    <TextInput
                        name="email"
                        label={I18n.t('auth.labels.email')}
                        value={form.email}
                        onChange={onInputChange(setFormField)}
                        error={errors.email}
                        processing={step === 0 && isProcessing}
                        autoComplete="email"
                        autoFocus
                        preserveLabelSpace
                        preserveErrorSpace
                    />
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.forgotPassword.link.send" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep
                    title={I18n.t('auth.forgotPassword.link.sent')}
                    showSignin
                    className={AuthStep.styles.spaceLarge}
                >
                    <p>
                        <Translate value="auth.forgotPassword.successMessage" />
                    </p>
                </AuthStep>
            </AuthPanel>
        </AuthLayout>
    )
}

export { ForgotPasswordPage }

export default userIsNotAuthenticated((props: Props) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <ForgotPasswordPage {...props} />
    </AuthFormProvider>
))
