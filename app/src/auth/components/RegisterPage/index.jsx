// @flow

import React, { useCallback, useContext } from 'react'
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
import TextInput from '../TextInput'
import Actions from '../Actions'
import Button from '../Button'
import Checkbox from '../Checkbox'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

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

    return (
        <AuthLayout>
            <AuthPanel
                validationSchemas={schemas}
                onValidationError={setFieldError}
            >
                <AuthStep title={I18n.t('general.signUp')} showSignin>
                    <TextInput
                        name="name"
                        label={I18n.t('auth.register.name')}
                        type="text"
                        value={form.name}
                        onChange={onInputChange(setFormField)}
                        error={errors.name}
                        processing={step === 0 && isProcessing}
                        autoComplete="name"
                        disabled={!form.invite}
                        autoFocus
                        preserveLabelSpace
                        preserveErrorSpace
                    />
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.next" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep title={I18n.t('general.signUp')} showBack>
                    <TextInput
                        name="password"
                        type="password"
                        label={I18n.t('auth.password.create')}
                        value={form.password}
                        onChange={onInputChange(setFormField)}
                        error={errors.password}
                        processing={step === 1 && isProcessing}
                        autoComplete="new-password"
                        measureStrength
                        autoFocus
                        preserveLabelSpace
                        preserveErrorSpace
                    />
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.next" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep title={I18n.t('general.signUp')} showBack>
                    <TextInput
                        name="confirmPassword"
                        type="password"
                        label={I18n.t('auth.password.confirm')}
                        value={form.confirmPassword}
                        onChange={onInputChange(setFormField)}
                        error={errors.confirmPassword}
                        processing={step === 2 && isProcessing}
                        autoComplete="new-password"
                        autoFocus
                        preserveLabelSpace
                        preserveErrorSpace
                    />
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
                        <Checkbox
                            name="toc"
                            checked={form.toc}
                            onChange={onInputChange(setFormField)}
                            error={errors.toc}
                            autoFocus
                            keepError
                        >
                            <Translate
                                value="auth.register.agreement"
                                terms={routes.terms()}
                                privacy={routes.privacy()}
                                dangerousHTML
                            />
                        </Checkbox>
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
