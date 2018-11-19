// @flow

import * as React from 'react'
import * as yup from 'yup'
import qs from 'query-string'
import { I18n, Translate } from 'react-redux-i18n'

import AuthPanel from '../AuthPanel'
import TextInput from '$shared/components/TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/resetPassword'
import type { AuthFlowProps } from '$shared/flowtype/auth-types'
import routes from '$routes'

type Props = AuthFlowProps & {
    history: {
        replace: (string) => void,
    },
    location: {
        search: string,
        pathname: string,
    },
    form: {
        password: string,
        confirmPassword: string,
        token: string,
    },
}

class ResetPasswordPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        const { setFormField, location: { search }, setFieldError } = props
        const token = qs.parse(search).t || ''

        setFormField('token', token, () => {
            yup
                .object()
                .shape({
                    token: yup.reach(schemas[0], 'token'),
                })
                .validate(this.props.form)
                .then(
                    () => {
                        // To make sure that the resetPassword token doesn't stick in the browser history
                        props.history.replace(props.location.pathname)
                    },
                    (error: yup.ValidationError) => {
                        setFieldError('password', error.message)
                    },
                )
        })
    }

    onFailure = (error: Error) => {
        const { setFieldError } = this.props
        setFieldError('confirmPassword', error.message)
    }

    submit = () => {
        const { password, confirmPassword: password2, token: t } = this.props.form

        return post(routes.externalResetPassword(), {
            password,
            password2,
            t,
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
            redirect,
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
                        title={I18n.t('auth.resetPassword')}
                    >
                        <TextInput
                            name="password"
                            type="password"
                            label={I18n.t('auth.password.create')}
                            value={form.password}
                            onChange={onInputChange(setFormField)}
                            error={errors.password}
                            processing={step === 0 && isProcessing}
                            autoComplete="new-password"
                            disabled={!form.token}
                            measureStrength
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
                        title={I18n.t('auth.resetPassword')}
                        onSubmit={this.submit}
                        onSuccess={redirect}
                        onFailure={this.onFailure}
                        showBack
                    >
                        <TextInput
                            name="confirmPassword"
                            type="password"
                            label={I18n.t('auth.password.confirm')}
                            value={form.confirmPassword}
                            onChange={onInputChange(setFormField)}
                            error={errors.confirmPassword}
                            processing={step === 1 && isProcessing}
                            autoComplete="new-password"
                            autoFocus
                            preserveLabelSpace
                        />
                        <Actions>
                            <Button disabled={isProcessing}>
                                <Translate value="auth.finish" />
                            </Button>
                        </Actions>
                    </AuthStep>
                </AuthPanel>
            </AuthLayout>
        )
    }
}

export default ResetPasswordPage
