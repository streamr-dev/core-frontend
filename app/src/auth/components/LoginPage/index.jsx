// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'

import AuthPanel from '../AuthPanel'
import TextInput from '$shared/components/TextInput'
import Actions from '../Actions'
import Button from '../Button'
import Checkbox from '../Checkbox'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/login'
import type { AuthFlowProps } from '$shared/flowtype/auth-types'
import routes from '$routes'
import styles from './loginPage.pcss'

type Props = AuthFlowProps & {
    form: {
        email: string,
        password: string,
        rememberMe: boolean,
    },
}

// NOTE: Spring security service requires its own input names

class LoginPage extends React.Component<Props> {
    onFailure = (error: Error) => {
        const { setFieldError } = this.props
        setFieldError('password', error.message)
    }

    submit = () => {
        const { email, password, rememberMe } = this.props.form

        return post(routes.externalLogin(), {
            j_username: email,
            j_password: password,
            ...(rememberMe ? {
                _spring_security_remember_me: 'on',
            } : {}),
        }, true, true)
    }

    render = () => {
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
                        title={I18n.t('general.signIn')}
                        showSignup
                        autoSubmitOnChange={['hiddenPassword']}
                    >
                        <TextInput
                            name="email"
                            label={I18n.t('auth.labels.email')}
                            value={form.email}
                            onChange={onInputChange(setFormField)}
                            error={errors.email}
                            processing={step === 0 && isProcessing}
                            autoComplete="email"
                            className={styles.emailInput}
                            autoFocus
                            preserveLabelSpace
                        />
                        <input
                            name="hiddenPassword"
                            type="password"
                            onChange={(e) => {
                                onInputChange(setFormField, 'password')(e)
                            }}
                            value={form.password}
                            style={{
                                display: 'none',
                            }}
                        />
                        <Actions>
                            <Button disabled={isProcessing}>
                                <Translate value="auth.next" />
                            </Button>
                        </Actions>
                    </AuthStep>
                    <AuthStep
                        title={I18n.t('general.signIn')}
                        showBack
                        onSubmit={this.submit}
                        onSuccess={redirect}
                        onFailure={this.onFailure}
                    >
                        <input
                            name="email"
                            type="text"
                            value={form.email}
                            readOnly
                            style={{
                                display: 'none',
                            }}
                        />
                        <TextInput
                            name="password"
                            type="password"
                            label={I18n.t('auth.labels.password')}
                            value={form.password}
                            onChange={onInputChange(setFormField)}
                            error={errors.password}
                            processing={step === 1 && isProcessing}
                            autoComplete="current-password"
                            className={styles.passwordInput}
                            autoFocus
                            preserveLabelSpace
                        />
                        <Actions>
                            <Checkbox
                                name="rememberMe"
                                checked={form.rememberMe}
                                onChange={onInputChange(setFormField)}
                            >
                                <Translate value="auth.login.rememberMe" />
                            </Checkbox>
                            <Link to={routes.forgotPassword()}>
                                <Translate value="auth.login.forgotPassword" />
                            </Link>
                            <Button className={styles.button} disabled={isProcessing}>
                                <Translate value="auth.go" />
                            </Button>
                        </Actions>
                    </AuthStep>
                </AuthPanel>
            </AuthLayout>
        )
    }
}

export default LoginPage
