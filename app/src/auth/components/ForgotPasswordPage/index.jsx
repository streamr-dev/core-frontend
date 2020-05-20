// @flow

import React, { useContext, useCallback } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { useDispatch } from 'react-redux'
import qs from 'query-string'
import { push } from 'connected-react-router'

import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import AuthPanel from '../AuthPanel'
import Actions from '../Actions'
import Button from '../Button'
import AuthStep from '../AuthStep'
import AuthLayout from '../AuthLayout'
import Text from '$ui/Text'
import Label from '$ui/Label'
import Underline from '$ui/Underline'
import Errors from '$ui/Errors'

import schemas from '../../schemas/forgotPassword'
import post from '../../utils/post'
import onInputChange from '../../utils/onInputChange'
import routes from '$routes'

type Props = {
    from?: string,
    location: {
        search: string,
    },
}

type Form = {
    email: string,
}

const initialForm: Form = {
    email: '',
}

const ForgotPasswordPage = ({ from }: Props) => {
    const {
        errors,
        form,
        isProcessing,
        setFieldError,
        setFormField,
        step,
    } = useContext(AuthFormContext)
    const dispatch = useDispatch()

    const onFailure = useCallback(({ message }: Error) => {
        setFieldError('email', message)
    }, [setFieldError])

    const submit = useCallback(() => {
        const { email: username } = form

        return post(routes.auth.external.forgotPassword(), {
            username,
        }, false, true)
    }, [form])

    const onBack = useCallback(() => {
        if (from === 'profile') {
            dispatch(push(routes.profile()))
        }
    }, [from, dispatch])

    return (
        <AuthLayout>
            <AuthPanel
                validationSchemas={schemas}
                onValidationError={setFieldError}
                onPrev={onBack}
            >
                <AuthStep
                    title={I18n.t('auth.forgotPassword.link.get')}
                    onSubmit={submit}
                    onFailure={onFailure}
                    showSignin={!from}
                    showBack={!!from}
                >
                    <Label state={errors.email && 'ERROR'}>
                        <Translate value="auth.labels.email" />
                    </Label>
                    <Text
                        unstyled
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onInputChange(setFormField)}
                        autoComplete="email"
                        autoFocus
                    />
                    <Underline
                        state={(step === 0 && isProcessing && 'PROCESSING') || (errors.email && 'ERROR')}
                    />
                    <Errors>
                        {errors.email}
                    </Errors>
                    <Actions>
                        <Button disabled={isProcessing}>
                            <Translate value="auth.forgotPassword.link.send" />
                        </Button>
                    </Actions>
                </AuthStep>
                <AuthStep
                    title={I18n.t('auth.forgotPassword.link.sent')}
                    showSignin={!from}
                    showBack={!!from}
                    className={AuthStep.styles.spaceLarge}
                >
                    <p>
                        <Translate value="auth.forgotPassword.successMessage" />
                    </p>
                </AuthStep>
            </AuthPanel>
        </AuthLayout>
    )
}

export { ForgotPasswordPage }

export default (props: Props) => {
    const from = qs.parse(props.location.search).from || ''

    return (
        <AuthFormProvider initialStep={0} initialForm={initialForm}>
            <ForgotPasswordPage {...props} from={from} />
        </AuthFormProvider>
    )
}
