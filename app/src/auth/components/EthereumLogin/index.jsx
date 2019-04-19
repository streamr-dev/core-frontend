// @flow

import React, { useContext, useCallback } from 'react'
import { I18n } from 'react-redux-i18n'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import SessionContext from '../../contexts/Session'
import AuthPanel from '$auth/components/AuthPanel'
import AuthStep from '$auth/components/AuthStep'
import TextInput from '$shared/components/TextInput'
import getSessionToken from '$auth/utils/getSessionToken'
import { getWeb3 } from '$shared/web3/web3Provider'

type Props = {
    onBackClick: () => void,
}

type Form = {
    ethereum: any,
}

const initialForm: Form = {
    ethereum: null,
}

const EthereumLogin = ({ onBackClick }: Props) => {
    const {
        errors,
        isProcessing,
        redirect,
        setFieldError,
        step,
    } = useContext(AuthFormContext)

    const mountedRef = useIsMountedRef()

    const { setSessionToken } = useContext(SessionContext)

    const submit = useCallback(async () => {
        const web3 = getWeb3()
        const accounts = await (async () => {
            try {
                return await web3.eth.getAccounts()
            } catch (e) {
                return null
            }
        })()

        if (!mountedRef.current) {
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
                setFieldError('ethereum', I18n.t('auth.login.failure'))
                return null
            }
        })()

        if (setSessionToken && mountedRef.current) {
            setSessionToken(token)
        }
    }, [setFieldError, mountedRef, setSessionToken])

    return (
        <AuthPanel
            onPrev={onBackClick}
            validationSchemas={[]}
            onValidationError={setFieldError}
        >
            <AuthStep
                title={I18n.t('auth.signInWithEthereum')}
                showBack
                autoSubmitOnMount
                onSubmit={submit}
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

export { EthereumLogin }

export default (props: Props) => (
    <AuthFormProvider initialStep={0} initialForm={initialForm}>
        <EthereumLogin {...props} />
    </AuthFormProvider>
)
