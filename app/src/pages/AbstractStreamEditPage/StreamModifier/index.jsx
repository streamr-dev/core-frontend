import React, { useMemo, useCallback, useEffect, useReducer, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useClient } from 'streamr-client-react'
import cloneDeep from 'lodash/cloneDeep'
import useModal from '$shared/hooks/useModal'
import ValidationErrorProvider from '$shared/components/ValidationErrorProvider'
import TransientStreamContext from '$shared/contexts/TransientStreamContext'
import StreamModifierContext from '$shared/contexts/StreamModifierContext'
import StreamModifierStatusContext from '$shared/contexts/StreamModifierStatusContext'
import useStream from '$shared/hooks/useStream'
import useInterrupt from '$shared/hooks/useInterrupt'
import requirePositiveBalance from '$shared/utils/requirePositiveBalance'
import getClientAddress from '$app/src/getters/getClientAddress'
import InterruptionError from '$shared/errors/InterruptionError'
import { networks } from '$shared/utils/constants'
import DuplicateError from '$shared/errors/DuplicateError'
import { useStreamSetter } from '$shared/contexts/StreamSetterContext'
import useValidateNetwork from '$shared/hooks/useValidateNetwork'
import routes from '$routes'
import ConfirmExitModal from './ConfirmExitModal'
import ChangeLossWatcher from './ChangeLossWatcher'
import reducer, { initialState, Init, SetBusy, Modify } from './reducer'

export default function StreamModifier({ children, onValidate }) {
    const stream = useStream()

    const [{ paramsModified, clean, busy }, dispatch] = useReducer(reducer, reducer(initialState, {
        type: Init,
        payload: stream,
    }))

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

    const client = useClient()

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

    const commit = useCallback(async () => {
        dispatch({
            type: SetBusy,
            payload: true,
        })

        const { current: newParams } = paramsModifiedRef

        const { requireUninterrupted } = itp()

        const { current: validate } = onValidateRef

        try {
            try {
                if (typeof validate === 'function') {
                    validate(newParams)
                }

                if (typeof validateNetworkRef.current === 'function') {
                    await validateNetworkRef.current(networks.STREAMS)
                }

                const clientAddress = await getClientAddress(client)

                requireUninterrupted()

                await requirePositiveBalance(clientAddress)

                requireUninterrupted()

                const innerStream = await (async () => {
                    if (!stream.id) {
                        try {
                            return client.createStream(newParams)
                        } catch (e) {
                            if (e.code === 'DUPLICATE_NOT_ALLOWED') {
                                throw new DuplicateError()
                            }

                            throw e
                        }
                    }

                    const copy = cloneDeep(stream)

                    Object.assign(copy, newParams)

                    await copy.update()

                    return copy
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
                dispatch({
                    type: SetBusy,
                    payload: false,
                })
            }

            throw e
        }
    }, [itp, client, stream])

    const cleanRef = useRef(clean)

    useEffect(() => {
        cleanRef.current = clean
    }, [clean])

    const { api: confirmExitDialog } = useModal('confirmExit')

    const history = useHistory()

    const value = useMemo(() => ({
        commit,
        stage: (change) => void dispatch({
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
    }), [itp, commit, history, confirmExitDialog])

    const status = useMemo(() => ({
        busy,
        clean,
    }), [busy, clean])

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp])

    return (
        <StreamModifierContext.Provider value={value}>
            <TransientStreamContext.Provider value={paramsModified}>
                <StreamModifierStatusContext.Provider value={status}>
                    <ValidationErrorProvider>
                        {children}
                    </ValidationErrorProvider>
                    <ConfirmExitModal />
                    <ChangeLossWatcher />
                </StreamModifierStatusContext.Provider>
            </TransientStreamContext.Provider>
        </StreamModifierContext.Provider>
    )
}
