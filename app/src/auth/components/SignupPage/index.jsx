// @flow

import * as React from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import AuthPanel from '../AuthPanel'
import TextInput from '$shared/components/TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/signup'
import type { AuthFlowProps } from '$shared/flowtype/auth-types'
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
                        title={I18n.t('general.signUp')}
                        showEth={false}
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
                            autoComplete="off"
                            autoFocus
                            preserveLabelSpace
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
}

export default SignupPage
