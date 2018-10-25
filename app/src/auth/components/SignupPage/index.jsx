// @flow

import * as React from 'react'

import AuthPanel from '../AuthPanel'
import TextInput from '../TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep, { styles as stepStyles } from '../AuthStep'
import AuthLayout from '../AuthLayout'

import post from '../../utils/post'
import schemas from '../../schemas/signup'
import type { AuthFlowProps } from '../../flowtype'
import routes from '$routes'

type Props = AuthFlowProps & {
    form: {
        email: string,
        password: string,
        confirmPassword: string,
        timezone: string,
        toc: boolean,
    },
}

class SignupPage extends React.Component<Props> {
    onFailure = (error: Error) => {
        const { setFieldError } = this.props
        setFieldError('email', error.message)
    }

    submit = () => {
        const { email: username } = this.props.form

        return post(routes.externalSignUp(), {
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
                        title="Sign up"
                        showEth={false}
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
                            autoComplete="off"
                            autoFocus
                        />
                        <Actions>
                            <Button disabled={isProcessing}>Next</Button>
                        </Actions>
                    </AuthStep>
                    <AuthStep
                        title="Thanks for signing up!"
                        showSignin
                        className={stepStyles.spaceLarge}
                    >
                        <p>We have sent a sign up link to your email.</p>
                        <p>Please click it to finish your registration.</p>
                    </AuthStep>
                </AuthPanel>
            </AuthLayout>
        )
    }
}

export default SignupPage
