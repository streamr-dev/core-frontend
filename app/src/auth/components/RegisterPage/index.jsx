// @flow

import React, { useCallback, useContext, useMemo } from 'react'
import qs from 'query-string'
import * as yup from 'yup'
import { I18n, Translate } from 'react-redux-i18n'
import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import getSessionToken from '$auth/utils/getSessionToken'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import useOnMount from '$shared/hooks/useOnMount'
import AuthFormProvider from '../AuthFormProvider'
import SessionProvider from '../SessionProvider'
import AuthFormContext from '../../contexts/AuthForm'
import SessionContext from '../../contexts/Session'
import AuthPanel from '../AuthPanel'
import Actions from '../Actions'
import Button from '../Button'
import Checkbox from '$shared/components/Checkbox'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'
import Text from '$ui/Text'
import FormControlLabel from '$shared/components/FormControlLabel'
import FormControlUnderline from '$shared/components/FormControlUnderline'
import FormControlErrors from '$shared/components/FormControlErrors'
import usePasswordStrength, { StrengthMessage, strengthToState } from '$shared/hooks/usePasswordStrength'

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/register'
import routes from '$routes'

import styles from './registerPage.pcss'

type Props = {
    history: {
        replace: (string) => void,
    },
    location: {
        pathname: string,
        search: string,
    },
}

type Form = {
    confirmPassword: string,
    invite: string,
    name: string,
    password: string,
    toc: boolean,
}

const initialForm: Form = {
    confirmPassword: '',
    invite: '',
    name: '',
    password: '',
    toc: false,
}

const RegisterPage = ({ location: { search, pathname }, history: { replace } }: Props) => {
    const mountedRef = useIsMountedRef()

    const {
        errors,
        form,
        isProcessing,
        redirect,
        setFieldError,
        setFormField,
        step,
    } = useContext(AuthFormContext)

    useOnMount(() => {
        const invite = qs.parse(search).invite || ''

        // Set and validate `invite` on mount.
        setFormField('invite', invite)

        yup.object().shape({
            invite: yup.reach(schemas[0], 'invite'),
        }).validate({
            invite,
        }).then(
            () => {
                if (mountedRef.current) {
                    // To make sure that the registerPage invite doesn't stick in the browser history
                    replace(pathname)
                }
            },
            ({ message }: yup.ValidationError) => {
                if (mountedRef.current) {
                    setFieldError('name', message)
                }
            },
        )
    })

    const onFailure = useCallback(({ message }: Error) => {
        setFieldError('toc', message)
    }, [setFieldError])

    const { setSessionToken } = useContext(SessionContext)

    const submit = useCallback(() => {
        const {
            name,
            password,
            confirmPassword: password2,
            toc: tosConfirmed,
            invite,
        } = form

        return post(routes.externalRegister(), {
            name,
            password,
            password2,
            tosConfirmed,
            invite,
        }, false, true).then(({ username }) => mountedRef.current && (
            getSessionToken({
                username,
                password,
            }).then((token) => {
                if (setSessionToken && mountedRef.current) {
                    setSessionToken(token)
                }
            })
        ))
    }, [form, setSessionToken, mountedRef])

    const strength = usePasswordStrength(form.password)

    const strengthState = useMemo(() => (
        strengthToState(strength)
    ), [strength])

    return (
        <AuthLayout>
            <AuthPanel
                validationSchemas={schemas}
                onValidationError={setFieldError}
            >
                <AuthStep title={I18n.t('general.signUp')} showSignin>
                    <FormControlLabel state={errors.name && 'ERROR'}>
                        <Translate value="auth.register.name" />
                    </FormControlLabel>
                    <Text
                        unstyled
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={onInputChange(setFormField)}
                        autoComplete="name"
                        disabled={!form.invite}
                        autoFocus
                    />
                    <FormControlUnderline
                        state={(step === 0 && isProcessing && 'PROCESSING') || (errors.name && 'ERROR')}
                    />
                    <FormControlErrors>
                        {errors.name}
                    </FormControlErrors>
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.next" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep title={I18n.t('general.signUp')} showBack>
                    <FormControlLabel state={(errors.password && 'ERROR') || strengthState}>
                        {strength === -1 ? (
                            <Translate value="auth.password.create" />
                        ) : (
                            <StrengthMessage strength={strength} />
                        )}
                    </FormControlLabel>
                    <Text
                        unstyled
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onInputChange(setFormField)}
                        autoComplete="new-password"
                        autoFocus
                    />
                    <FormControlUnderline
                        state={(step === 1 && isProcessing && 'PROCESSING') || (errors.password && 'ERROR') || strengthState}
                    />
                    <FormControlErrors>
                        {errors.password}
                    </FormControlErrors>
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.next" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep title={I18n.t('general.signUp')} showBack>
                    <FormControlLabel state={errors.confirmPassword && 'ERROR'}>
                        <Translate value="auth.password.confirm" />
                    </FormControlLabel>
                    <Text
                        unstyled
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={onInputChange(setFormField)}
                        autoComplete="new-password"
                        autoFocus
                    />
                    <FormControlUnderline
                        state={(step === 2 && isProcessing && 'PROCESSING') || (errors.confirmPassword && 'ERROR')}
                    />
                    <FormControlErrors>
                        {errors.confirmPassword}
                    </FormControlErrors>
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.next" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep
                    title={I18n.t('auth.register.terms')}
                    onSubmit={submit}
                    onSuccess={redirect}
                    onFailure={onFailure}
                    showBack
                >
                    <div className={styles.termsWrapper}>
                        <label htmlFor="toc" className={styles.checkboxWrapper}>
                            <Checkbox
                                id="toc"
                                name="toc"
                                value={form.toc}
                                onChange={onInputChange(setFormField)}
                                autoFocus
                            />&nbsp;
                            <Translate
                                value="auth.register.agreement"
                                terms={routes.terms()}
                                privacy={routes.privacy()}
                                dangerousHTML
                            />
                        </label>
                        <FormControlErrors>
                            {errors.toc}
                        </FormControlErrors>
                    </div>
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

export { RegisterPage }

export default userIsNotAuthenticated((props: Props) => (
    <SessionProvider>
        <AuthFormProvider initialStep={0} initialForm={initialForm}>
            <RegisterPage {...props} />
        </AuthFormProvider>
    </SessionProvider>
))
