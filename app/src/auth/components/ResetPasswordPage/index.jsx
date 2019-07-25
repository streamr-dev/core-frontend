// @flow

import React, { useContext, useCallback } from 'react'
import { connect } from 'react-redux'
import * as yup from 'yup'
import qs from 'query-string'
import { I18n, Translate } from 'react-redux-i18n'
import { push } from 'connected-react-router'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import useOnMount from '$shared/hooks/useOnMount'
import AuthFormProvider from '../AuthFormProvider'
import { userIsNotAuthenticated } from '$mp/utils/auth'
import AuthFormContext from '$auth/contexts/AuthForm'
import AuthPanel from '../AuthPanel'
import TextInput from '$shared/components/TextInput'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

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

    return (
        <AuthLayout>
            <AuthPanel
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
                        preserveErrorSpace
                    />
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
                        preserveErrorSpace
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

export { ResetPasswordPage }

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    redirectToLoginPage: () => dispatch(push(routes.login())),
})

export default connect(null, mapDispatchToProps)(userIsNotAuthenticated((props: Props) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <ResetPasswordPage {...props} />
    </AuthFormProvider>
)))
