// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import AuthPanel from '$auth/components/AuthPanel'
import AuthStep from '$auth/components/AuthStep'
import TextInput from '$shared/components/TextInput'
import getSessionToken from '$auth/utils/getSessionToken'
import { getWeb3 } from '$shared/web3/web3Provider'
import { type Props as SessionProps } from '$auth/contexts/Session'
import { type AuthFlowProps } from '$shared/flowtype/auth-types'

type Props = SessionProps & AuthFlowProps & {
    form: {
        ethereum: null,
    }
}

class EthereumLogin extends React.Component<Props> {
    componentWillUnmount() {
        this.unmounted = true
    }

    submit = async () => {
        const { setSessionToken, setFieldError } = this.props
        const web3 = getWeb3()
        const accounts = await web3.eth.getAccounts()

        if (this.unmounted) {
            return
        }

        if (!Array.isArray(accounts) || accounts.length === 0) {
            setFieldError('ethereum', 'MetaMask browser extension is locked')
            return
        }

        const token: ?string = await (async () => {
            try {
                return await getSessionToken({
                    provider: web3.currentProvider,
                })
            } catch (e) {
                if (/denied message signature/i.test(e.message)) {
                    if (!this.unmounted) {
                        setFieldError('ethereum', 'User denied message signature')
                    }
                    return null
                }
                throw e
            }
        })()

        if (setSessionToken && !this.unmounted) {
            setSessionToken(token)
        }
    }

    unmounted: boolean = false

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
            redirect,
        } = this.props

        return (
            <AuthPanel
                currentStep={step}
                form={form}
                onPrev={prev}
                onNext={next}
                setIsProcessing={setIsProcessing}
                isProcessing={isProcessing}
                validationSchemas={[]}
                onValidationError={setFieldError}
            >
                <AuthStep
                    title={I18n.t('auth.signInWithEthereum')}
                    showBack
                    autoSubmitOnMount
                    onSubmit={this.submit}
                    onSuccess={redirect}
                    className={AuthStep.styles.spaceLarge}
                >
                    <TextInput
                        name="ethereum"
                        label=""
                        value={I18n.t('auth.labels.ethereum')}
                        error={errors.ethereum}
                        readOnly
                        processing={step === 0 && isProcessing}
                        preserveErrorSpace
                    />
                </AuthStep>
            </AuthPanel>
        )
    }
}

export default EthereumLogin
