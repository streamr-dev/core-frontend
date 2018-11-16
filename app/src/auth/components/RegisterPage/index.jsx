// @flow

import * as React from 'react'
import qs from 'query-string'
import * as yup from 'yup'
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
import schemas from '../../schemas/register'
import type { AuthFlowProps } from '$shared/flowtype/auth-types'
import routes from '$routes'

import styles from './registerPage.pcss'

type Props = AuthFlowProps & {
    history: {
        replace: (string) => void,
    },
    location: {
        search: string,
        pathname: string,
    },
    form: {
        email: string,
        password: string,
        confirmPassword: string,
        toc: boolean,
        invite: string,
    },
}

class RegisterPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props)

        const { setFormField, location: { search }, setFieldError } = props
        setFormField('invite', qs.parse(search).invite || '', () => {
            yup
                .object()
                .shape({
                    invite: yup.reach(schemas[0], 'invite'),
                })
                .validate(this.props.form)
                .then(
                    () => {
                        // To make sure that the registerPage invite doesn't stick in the browser history
                        props.history.replace(props.location.pathname)
                    },
                    (error: yup.ValidationError) => {
                        setFieldError('name', error.message)
                    },
                )
        })
    }

    onFailure = (error: Error) => {
        const { setFieldError } = this.props
        setFieldError('toc', error.message)
    }

    submit = () => {
        const {
            name,
            password,
            confirmPassword: password2,
            toc: tosConfirmed,
            invite,
        } = this.props.form

        return post(routes.externalRegister(), {
            name,
            password,
            password2,
            tosConfirmed,
            invite,
        }, false, true)
    }

    render() {
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
                    <AuthStep title={I18n.t('general.signUp')} showEth={false} showSignin>
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
                        />
                        <Actions>
                            <Button disabled={isProcessing}>
                                <Translate value="auth.next" />
                            </Button>
                        </Actions>
                    </AuthStep>
                    <AuthStep
                        title={I18n.t('auth.register.terms')}
                        onSubmit={this.submit}
                        onSuccess={redirect}
                        onFailure={this.onFailure}
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
}

export default RegisterPage
