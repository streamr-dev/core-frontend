// @flow

import * as React from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import AuthPanel from '../AuthPanel'
import TextInput from '$shared/components/TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import schemas from '../../schemas/forgotPassword'
import type { AuthFlowProps } from '$shared/flowtype/auth-types'
import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
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
        }, false, true)
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
                        title={I18n.t('auth.forgotPassword.link.get')}
                        onSubmit={this.submit}
                        onFailure={this.onFailure}
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
}

export default ForgotPasswordPage
