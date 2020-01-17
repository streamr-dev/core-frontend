// @flow

import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import SessionContext from '../../contexts/Session'
import AuthPanel from '../AuthPanel'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import { Text } from '$shared/components/Input'
import FormControlLabel from '$shared/components/FormControlLabel'
import FormControlUnderline from '$shared/components/FormControlUnderline'
import FormControlErrors from '$shared/components/FormControlErrors'

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
}

const initialForm: Form = {
    email: '',
    password: '',
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
                <FormControlLabel state={errors.email && 'ERROR'}>
                    <Translate value="auth.labels.email" />
                </FormControlLabel>
                <Text
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onInputChange(setFormField)}
                    autoComplete="email"
                    className={styles.emailInput}
                    autoFocus
                />
                <FormControlUnderline
                    state={(step === 0 && isProcessing && 'PROCESSING') || (errors.email && 'ERROR')}
                />
                <FormControlErrors>
                    {errors.email}
                </FormControlErrors>
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
                <FormControlLabel state={errors.password && 'ERROR'}>
                    <Translate value="auth.labels.password" />
                </FormControlLabel>
                <Text
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onInputChange(setFormField)}
                    autoComplete="current-password"
                    className={styles.passwordInput}
                    autoFocus
                />
                <FormControlUnderline
                    state={(step === 1 && isProcessing && 'PROCESSING') || (errors.password && 'ERROR')}
                />
                <FormControlErrors>
                    {errors.password}
                </FormControlErrors>
                <Actions>
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
