// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'

import AuthPanel from '../AuthPanel'
import TextInput from '../TextInput'
import Actions from '../Actions'
import Button from '../Button'
import Checkbox from '../Checkbox'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/login'
import type { AuthFlowProps } from '../../flowtype'
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
                    <AuthStep title="Sign in" showSignup autoSubmitOnChange={['hiddenPassword']}>
                        <TextInput
                            name="email"
                            label="Email"
                            value={form.email}
                            onChange={setFormField}
                            error={errors.email}
                            processing={step === 0 && isProcessing}
                            autoComplete="email"
                            className={styles.emailInput}
                            autoFocus
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
                            <Button disabled={isProcessing}>Next</Button>
                        </Actions>
                    </AuthStep>
                    <AuthStep
                        title="Sign in"
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
                            label="Password"
                            value={form.password}
                            onChange={setFormField}
                            error={errors.password}
                            processing={step === 1 && isProcessing}
                            autoComplete="current-password"
                            className={styles.passwordInput}
                            autoFocus
                        />
                        <Actions>
                            <Checkbox
                                name="rememberMe"
                                checked={form.rememberMe}
                                onChange={onInputChange(setFormField)}
                            >
                                Remember me
                            </Checkbox>
                            <Link to={routes.forgotPassword()}>Forgot your password?</Link>
                            <Button className={styles.button} disabled={isProcessing}>Go</Button>
                        </Actions>
                    </AuthStep>
                </AuthPanel>
            </AuthLayout>
        )
    }
}

export default LoginPage
