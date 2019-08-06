// @flow

import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import SessionContext from '../../contexts/Session'
import AuthPanel from '../AuthPanel'
import TextInput from '$shared/components/TextInput'
import Actions from '../Actions'
import Button from '../Button'
import Checkbox from '../Checkbox'
import AuthStep from '../AuthStep'

import getSessionToken from '$auth/utils/getSessionToken'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/login'
import routes from '$routes'
import styles from './usernamePasswordLogin.pcss'

type Props = {
    onEthereumClick: () => void,
}

type Form = {
    email: string,
    password: string,
    rememberMe: boolean,
}

const initialForm: Form = {
    email: '',
    password: '',
    rememberMe: false,
}

const UsernamePasswordLogin = ({ onEthereumClick }: Props) => {
    const {
        form,
        setFieldError,
        step,
        errors,
        isProcessing,
        setFormField,
        redirect,
    } = useContext(AuthFormContext)

    const onFailure = useCallback(({ message }: Error) => {
        setFieldError('password', message)
    }, [setFieldError])

    const { setSessionToken } = useContext(SessionContext)

    const mountedRef = useIsMountedRef()

    const submit = useCallback(() => {
        const { email: username, password } = form

        return getSessionToken({
            username,
            password,
        }).then((token) => {
            if (setSessionToken && mountedRef.current) {
                setSessionToken(token)
            }
        })
    }, [form, mountedRef, setSessionToken])

    return (
        <AuthPanel
            validationSchemas={schemas}
            onValidationError={setFieldError}
        >
            <AuthStep
                title={I18n.t('general.signIn')}
                showSignup
                onEthereumClick={onEthereumClick}
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
                    preserveErrorSpace
                />
                <input
                    name="hiddenPassword"
                    type="password"
                    onChange={(e) => {
                        onInputChange(setFormField, 'password')(e)
                    }}
                    value={form.password}
                    hidden
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
                onSubmit={submit}
                onSuccess={redirect}
                onFailure={onFailure}
            >
                <input
                    name="email"
                    type="text"
                    value={form.email}
                    readOnly
                    hidden
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
                    preserveErrorSpace
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
    )
}

export { UsernamePasswordLogin }

export default (props: Props) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <UsernamePasswordLogin {...props} />
    </AuthFormProvider>
)
