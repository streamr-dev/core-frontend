// @flow

import React, { useCallback, useContext } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import { SM, MD } from '$shared/utils/styled'

import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import AuthPanel from '../AuthPanel'
import UnstyledAuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'

import post from '../../utils/post'
import schemas from '../../schemas/signup'
import routes from '$routes'

type Form = {
    email: string,
}

const initialForm: Form = {
    email: '',
}

const AuthStep = styled(UnstyledAuthStep)`
    && {
        text-align: center;
        line-height: 24px;
        padding: 34px 2.5rem 50px;
        font-size: 14px;

        @media (min-width: ${SM}px) {
            padding: 56px 2.5rem 72px;
            font-size: 16px;
        }

        @media (min-width: ${MD}px) {
            padding: 72px 2.5rem 88px;
        }
    }
`

const SignupPage = () => {
    const { form, setFieldError } = useContext(AuthFormContext)
    const { email: username } = form

    const onFailure = useCallback((error: Error) => {
        setFieldError('email', error.message)
    }, [setFieldError])

    const submit = useCallback(() => (
        post(routes.auth.external.signUp(), {
            username,
        }, false)
    ), [username])

    const dispatch = useDispatch()
    const onEthereumClick = useCallback(() => {
        dispatch(push(routes.auth.login({
            metamask: true,
        })))
    }, [dispatch])

    return (
        <AuthLayout>
            <AuthPanel
                validationSchemas={schemas}
                onValidationError={setFieldError}
            >
                <AuthStep
                    title="Authentication has changed"
                    onSubmit={submit}
                    onFailure={onFailure}
                    onEthereumClick={onEthereumClick}
                >
                    <div>
                        Email and password-based signups have been deprecated.
                        <br />
                        Please install MetaMask and authenticate with Ethereum.
                    </div>
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

export { SignupPage }

export default userIsNotAuthenticated((props: {}) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <SignupPage {...props} />
    </AuthFormProvider>
))
