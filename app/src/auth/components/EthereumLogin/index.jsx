// @flow

import React, { useContext, useCallback } from 'react'
import { I18n } from 'react-redux-i18n'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import AuthFormProvider from '../AuthFormProvider'
import AuthFormContext from '../../contexts/AuthForm'
import SessionContext from '../../contexts/Session'
import AuthPanel from '$auth/components/AuthPanel'
import AuthStep from '$auth/components/AuthStep'
import TextInput from '../TextInput'
import getSessionToken from '$auth/utils/getSessionToken'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'

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
        const web3 = await (async () => {
            try {
                return await validateWeb3({
                    web3: getWeb3(),
                    checkNetwork: false,
                })
            } catch (e) {
                setFieldError('ethereum', e.message)
                return null
            }
        })()

        if (!web3 || !mountedRef.current) {
            return
        }

        const token: ?string = await (async () => {
            try {
                return await getSessionToken({
                    // TODO: this is a hack, we pass an instance of the web3 injected by Metamask directly because the wrapped object
                    // in web3-beta.55 does not work (https://github.com/MetaMask/metamask-extension/issues/6080).
                    provider: window.web3.currentProvider,
                })
            } catch (e) {
                if (mountedRef.current) {
                    setFieldError('ethereum', I18n.t('auth.login.failure'))
                }
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
