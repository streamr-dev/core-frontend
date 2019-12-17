// @flow

import React, { useCallback, useContext } from 'react'
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

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/signup'
import routes from '$routes'

type Form = {
    email: string,
}

const initialForm: Form = {
    email: '',
}

const SignupPage = () => {
    const {
        errors,
        form,
        isProcessing,
        setFieldError,
        setFormField,
        step,
    } = useContext(AuthFormContext)
    const { email: username } = form

    const onFailure = useCallback((error: Error) => {
        setFieldError('email', error.message)
    }, [setFieldError])

    const submit = useCallback(() => (
        post(routes.externalSignUp(), {
            username,
        }, false, true)
    ), [username])

    return (
        <AuthLayout>
            <AuthPanel
                validationSchemas={schemas}
                onValidationError={setFieldError}
            >
                <AuthStep
                    title={I18n.t('general.signUp')}
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
                        autoComplete="off"
                        autoFocus
                        preserveLabelSpace
                        preserveErrorSpace
                    />
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.next" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep
                    title={I18n.t('auth.signUp.success.title')}
                    showSignin
                    className={AuthStep.styles.spaceLarge}
                >
                    <p>
                        <Translate value="auth.signUp.success.message.line0" />
                    </p>
                    <p>
                        <Translate value="auth.signUp.success.message.line1" />
                    </p>
                </AuthStep>
            </AuthPanel>
        </AuthLayout>
    )
}

export { SignupPage }

export default userIsNotAuthenticated((props: {}) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <SignupPage {...props} />
    </AuthFormProvider>
))
