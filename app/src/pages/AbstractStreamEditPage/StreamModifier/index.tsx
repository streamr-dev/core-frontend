import React, { useMemo, useCallback, useEffect, useReducer, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import StreamrClient from 'streamr-client'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import useModal from '$shared/hooks/useModal'
import ValidationErrorProvider from '$shared/components/ValidationErrorProvider'
import TransientStreamContext from '$shared/contexts/TransientStreamContext'
import StreamModifierContext from '$shared/contexts/StreamModifierContext'
import StreamModifierStatusContext from '$shared/contexts/StreamModifierStatusContext'
import useStream from '$shared/hooks/useStream'
import useInterrupt from '$shared/hooks/useInterrupt'
import requirePositiveBalance from '$shared/utils/requirePositiveBalance'
import InterruptionError from '$shared/errors/InterruptionError'
import { networks } from '$shared/utils/constants'
import DuplicateError from '$shared/errors/DuplicateError'
import { useStreamSetter } from '$shared/contexts/StreamSetterContext'
import useValidateNetwork from '$shared/hooks/useValidateNetwork'
import {useAuthController} from "$auth/hooks/useAuthController"
import getTransactionalClient from '$app/src/getters/getTransactionalClient'
import routes from '$routes'
import ConfirmExitModal from './ConfirmExitModal'
import reducer, { initialState, Init, SetBusy, Modify } from './reducer'

type Props = {
    children?: React.ReactNode,
    onValidate?: (params: any, client: StreamrClient) => Promise<void>,
}

export default function StreamModifier({ children, onValidate }: Props) {
    const stream = useStream()
    const [{ paramsModified, clean, busy }, dispatch] = useReducer(
        reducer,
        reducer(initialState, {
            type: Init,
            payload: stream,
        }),
    )
    const firstRunRef = useRef(true)
    useEffect(() => {
        if (firstRunRef.current) {
            firstRunRef.current = false
            return
        }

        dispatch({
            type: Init,
            payload: stream,
        })
    }, [stream])
    const paramsModifiedRef = useRef(paramsModified)
    useEffect(() => {
        paramsModifiedRef.current = paramsModified
    }, [paramsModified])
    const itp = useInterrupt()
    const onValidateRef = useRef(onValidate)
    useEffect(() => {
        onValidateRef.current = onValidate
    }, [onValidate])
    const { api: switchNetworkDialog } = useModal('switchNetwork')
    const switchNetworkDialogRef = useRef(switchNetworkDialog)
    useEffect(() => {
        switchNetworkDialogRef.current = switchNetworkDialog
    }, [switchNetworkDialog])
    const setStream = useStreamSetter()
    const setStreamRef = useRef(setStream)
    useEffect(() => {
        setStreamRef.current = setStream
    }, [setStream])
    const validateNetwork = useValidateNetwork()
    const validateNetworkRef = useRef(validateNetwork)
    useEffect(() => {
        validateNetworkRef.current = validateNetwork
    }, [validateNetwork])
    const {currentAuthSession} = useAuthController()

    const isUpdateNeeded = useCallback(() => {
        if (stream == null || stream.id == null) {
            return true
        }

        const { current: newParams } = paramsModifiedRef
        return !isEqual(stream.metadata, newParams.metadata)
    }, [stream])

    const setBusy = (busy: boolean) => {
        dispatch({
            type: SetBusy,
            payload: busy,
        })
    }

    const commit = useCallback(async () => {
        setBusy(true)
        const { current: newParams } = paramsModifiedRef
        const { requireUninterrupted } = itp()
        const { current: validate } = onValidateRef

        try {
            try {
                let client = await getTransactionalClient()
                
                if (typeof validate === 'function') {
                    await validate(newParams, client)
                }

                if (typeof validateNetworkRef.current === 'function') {
                    await validateNetworkRef.current(networks.STREAMS)
                }

                const clientAddress = currentAuthSession.address
                if (!clientAddress) {
                    throw new Error('No wallet connected')
                }
                requireUninterrupted()
                await requirePositiveBalance(clientAddress)
                requireUninterrupted()
                const innerStream = await (async () => {
                    if (!stream.id) {
                        let existingStream = null
                        try {
                            existingStream = await client.getStream(newParams.id)
                        } catch (e) {
                            // stream does not exist
                        }

                        if (existingStream != null) {
                            throw new DuplicateError()
                        }

                        const createParams = {
                            id: newParams.id,
                            ...newParams.metadata,
                        }

                        client = await getTransactionalClient()

                        const createdStream = await client.createStream(createParams)

                        return createdStream
                    }

                    if (isUpdateNeeded()) {
                        const copy = cloneDeep(stream)
                        Object.assign(copy, newParams)
                        await copy.update()
                        return copy
                    }
                    return stream
                })()
                requireUninterrupted()

                if (typeof setStreamRef.current === 'function') {
                    setStreamRef.current(innerStream)
                }

                return innerStream
            } catch (e) {
                requireUninterrupted()
                throw e
            }
        } catch (e) {
            if (!(e instanceof InterruptionError)) {
                setBusy(false)
            }

            throw e
        } finally {
            setBusy(false)
        }
    }, [itp, stream, currentAuthSession.address, isUpdateNeeded])
    const cleanRef = useRef(clean)
    useEffect(() => {
        cleanRef.current = clean
    }, [clean])
    const { api: confirmExitDialog } = useModal('confirmExit')
    const history = useHistory()
    const value = useMemo(
        () => ({
            commit,
            stage: (change) =>
                void dispatch({
                    type: Modify,
                    payload: change,
                }),
            goBack: () => {
                const { requireUninterrupted } = itp('navigate')

                if (cleanRef.current) {
                    history.push(routes.streams.index())
                    return
                }

                async function fn() {
                    try {
                        const { canProceed } = await confirmExitDialog.open()
                        requireUninterrupted()

                        if (canProceed) {
                            history.push(routes.streams.index())
                        }
                    } catch (e) {
                        // Noop.
                    }
                }

                fn()
            },
            isUpdateNeeded,
            validate: async () => {
                const fn = onValidateRef.current

                const client = await getTransactionalClient()

                if (fn && paramsModifiedRef.current) {
                    try {
                        setBusy(true)
                        await fn(paramsModifiedRef.current, client)
                    } catch (e) {
                        throw e
                    } finally {
                        setBusy(false)
                    }
                }
            },
            setBusy,
        }),
        [itp, commit, history, confirmExitDialog, isUpdateNeeded],
    )
    const status = useMemo(
        () => ({
            busy,
            clean,
        }),
        [busy, clean],
    )
    return (
        <StreamModifierContext.Provider value={value}>
            <TransientStreamContext.Provider value={paramsModified}>
                <StreamModifierStatusContext.Provider value={status}>
                    <ValidationErrorProvider>{children}</ValidationErrorProvider>
                    <ConfirmExitModal />
                </StreamModifierStatusContext.Provider>
            </TransientStreamContext.Provider>
        </StreamModifierContext.Provider>
    )
}
