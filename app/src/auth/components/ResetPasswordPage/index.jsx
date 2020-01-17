// @flow

import React, { useContext, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import * as yup from 'yup'
import qs from 'query-string'
import { I18n, Translate } from 'react-redux-i18n'
import { push } from 'connected-react-router'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import useOnMount from '$shared/hooks/useOnMount'
import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import AuthFormContext from '$auth/contexts/AuthForm'
import AuthFormProvider from '../AuthFormProvider'
import AuthPanel from '../AuthPanel'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'
import { Text } from '$shared/components/Input'
import FormControlLabel from '$shared/components/FormControlLabel'
import FormControlUnderline from '$shared/components/FormControlUnderline'
import FormControlErrors from '$shared/components/FormControlErrors'
import usePasswordStrength, { StrengthMessage, strengthToState } from '$shared/hooks/usePasswordStrength'

import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import schemas from '../../schemas/resetPassword'
import routes from '$routes'

export type DispatchProps = {
    redirectToLoginPage: () => void,
}

type Props = DispatchProps & {
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
    password: string,
    token: string,
}

const initialForm: Form = {
    confirmPassword: '',
    password: '',
    token: '',
}

const ResetPasswordPage = ({ location: { search, pathname }, history: { replace }, redirectToLoginPage }: Props) => {
    const {
        errors,
        form,
        isProcessing,
        setFieldError,
        setFormField,
        step,
    } = useContext(AuthFormContext)

    const onFailure = useCallback(({ message }: Error) => {
        setFieldError('confirmPassword', message)
    }, [setFieldError])

    const submit = useCallback(() => {
        const { password, confirmPassword: password2, token: t } = form

        return post(routes.externalResetPassword(), {
            password,
            password2,
            t,
        }, false, true)
    }, [form])

    const mountedRef = useIsMountedRef()

    useOnMount(() => {
        const token = qs.parse(search).t || ''

        // Set and validate token on mount.
        setFormField('token', token)

        yup
            .object()
            .shape({
                token: yup.reach(schemas[0], 'token'),
            })
            .validate({
                token,
            })
            .then(
                () => {
                    if (mountedRef.current) {
                        // To make sure that the resetPassword token doesn't stick in the browser history
                        replace(pathname)
                    }
                },
                ({ message }: yup.ValidationError) => {
                    if (mountedRef.current) {
                        setFieldError('password', message)
                    }
                },
            )
    })

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
                <AuthStep
                    title={I18n.t('auth.resetPassword')}
                >
                    <FormControlLabel state={(errors.password && 'ERROR') || strengthState}>
                        {strength === -1 ? (
                            <Translate value="auth.password.create" />
                        ) : (
                            <StrengthMessage strength={strength} />
                        )}
                    </FormControlLabel>
                    <Text
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onInputChange(setFormField)}
                        autoComplete="new-password"
                        disabled={!form.token}
                        autoFocus
                    />
                    <FormControlUnderline
                        state={(step === 0 && isProcessing && 'PROCESSING') || (errors.password && 'ERROR') || strengthState}
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
                <AuthStep
                    title={I18n.t('auth.resetPassword')}
                    onSubmit={submit}
                    // TODO: Sign the user in on success. Missing part: current reset password endpoint
                    //       doesn't respond with user instance so we don't have access to the email address.
                    onSuccess={redirectToLoginPage}
                    onFailure={onFailure}
                    showBack
                >
                    <FormControlLabel state={errors.confirmPassword && 'ERROR'}>
                        <Translate value="auth.password.confirm" />
                    </FormControlLabel>
                    <Text
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={onInputChange(setFormField)}
                        autoComplete="new-password"
                        autoFocus
                    />
                    <FormControlUnderline
                        state={(step === 1 && isProcessing && 'PROCESSING') || (errors.confirmPassword && 'ERROR')}
                    />
                    <FormControlErrors>
                        {errors.confirmPassword}
                    </FormControlErrors>
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

export { ResetPasswordPage }

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    redirectToLoginPage: () => dispatch(push(routes.login())),
})

export default connect(null, mapDispatchToProps)(userIsNotAuthenticated((props: Props) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <ResetPasswordPage {...props} />
    </AuthFormProvider>
)))
