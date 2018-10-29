// @flow

import * as React from 'react'

import AuthPanel from '../AuthPanel'
import TextInput from '../TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import schemas from '../../schemas/forgotPassword'
import type { AuthFlowProps } from '../../flowtype'
import post from '../../utils/post'
import routes from '$routes'

type Props = AuthFlowProps & {
    form: {
        email: string,
    },
}

class ForgotPasswordPage extends React.Component<Props> {
    onFailure = (error: Error) => {
        const { setFieldError } = this.props
        setFieldError('email', error.message)
    }

    submit = () => {
        const { email: username } = this.props.form

        return post(routes.externalForgotPassword(), {
            username,
        }, false, false)
    }

    render() {
        const {
            setIsProcessing,
            isProcessing,
            step,
            form,
            errors,
            setFieldError,
            next,
            prev,
            setFormField,
        } = this.props
        return (
            <AuthLayout>
                <AuthPanel
                    currentStep={step}
                    form={form}
                    onPrev={prev}
                    onNext={next}
                    setIsProcessing={setIsProcessing}
                    isProcessing={isProcessing}
                    validationSchemas={schemas}
                    onValidationError={setFieldError}
                >
                    <AuthStep
                        title="Get a link to reset your password"
                        onSubmit={this.submit}
                        onFailure={this.onFailure}
                        showSignin
                    >
                        <TextInput
                            name="email"
                            label="Email"
                            value={form.email}
                            onChange={setFormField}
                            error={errors.email}
                            processing={step === 0 && isProcessing}
                            autoComplete="email"
                            autoFocus
                        />
                        <Actions>
                            <Button disabled={isProcessing}>Send</Button>
                        </Actions>
                    </AuthStep>
                    <AuthStep
                        title="Link sent"
                        showSignin
                        className={AuthStep.styles.spaceLarge}
                    >
                        <p>
                            If a user with that email exists, we have sent a link to reset the password.
                            Please check your email and click the link — it may be in your spam folder!
                        </p>
                    </AuthStep>
                </AuthPanel>
            </AuthLayout>
        )
    }
}

export default ForgotPasswordPage
