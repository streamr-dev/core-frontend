import React, { useMemo, useCallback, useEffect, useReducer, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import useModal from '$shared/hooks/useModal'
import ConfirmDialog from '$shared/components/ConfirmDialog'
import ValidationErrorProvider from '$shared/components/ValidationErrorProvider'
import StreamContext from '$shared/contexts/StreamContext'
import StreamModifierContext from '$shared/contexts/StreamModifierContext'
import StreamModifierStatusContext, { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import useStream from '$shared/hooks/useStream'
import useInterrupt from '$shared/hooks/useInterrupt'
import requirePositiveBalance from '$shared/utils/requirePositiveBalance'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import getClientAddress from '$app/src/getters/getClientAddress'
import DuplicateError from '../errors/DuplicateError'

const Init = 'init'

const Reset = 'clean'

const SetBusy = 'set busy'

const Modify = 'modify'

const initialState = {
    busy: false,
    clean: true,
    modifiedStream: undefined,
    originalStream: undefined,
}

function reducer(state, { type, payload }) {
    switch (type) {
        case Init:
            return {
                ...initialState,
                originalStream: payload,
                modifiedStream: cloneDeep(payload),
            }
        case Reset:
            return {
                ...initialState,
                originalStream: state.originalStream,
                modifiedStream: cloneDeep(state.originalStream),
            }
        case SetBusy:
            return {
                ...state,
                busy: Boolean(payload),
            }
        case Modify:
            return ((modifiedStream) => ({
                ...state,
                modifiedStream,
                clean: isEqual(state.originalStream, modifiedStream),
            }))({
                ...state.modifiedStream,
                ...payload,
            })
        default:
    }

    return state
}

function ConfirmExitModal() {
    const { api, isOpen } = useModal('confirmExit')

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmDialog
            title="You have unsaved changes"
            message="You have made changes to this stream. Do you still want to exit?"
            onAccept={() => api.close({
                canProceed: true,
            })}
            onReject={() => api.close({
                canProceed: false,
            })}
        />
    )
}

function ChangeLossWatcher() {
    const { clean } = useStreamModifierStatusContext()

    usePreventNavigatingAway(
        'You have unsaved changes. Are you sure you want to leave?',
        () => !clean,
    )

    return null
}

export default function StreamModifier({ children, onValidate }) {
    const originalStream = useStream()

    const [{ modifiedStream, clean, busy }, dispatch] = useReducer(reducer, reducer(initialState, {
        type: Init,
        payload: originalStream,
    }))

    const firstRunRef = useRef(true)

    useEffect(() => {
        if (firstRunRef.current) {
            firstRunRef.current = false
            return
        }

        dispatch({
            type: Init,
            payload: originalStream,
        })
    }, [originalStream])

    const modifiedStreamRef = useRef(modifiedStream)

    useEffect(() => {
        modifiedStreamRef.current = modifiedStream
    }, [modifiedStream])

    const itp = useInterrupt()

    const client = useClient()

    const onValidateRef = useRef(onValidate)

    useEffect(() => {
        onValidateRef.current = onValidate
    }, [onValidate])

    const commit = useCallback(async () => {
        dispatch({
            type: SetBusy,
            payload: true,
        })

        const { current: params } = modifiedStreamRef

        const { requireUninterrupted } = itp()

        const { current: validate } = onValidateRef

        try {
            if (typeof validate === 'function') {
                validate(params)
            }
            // @TODO await validateNetwork()

            const clientAddress = await getClientAddress(client)

            requireUninterrupted()

            await requirePositiveBalance(clientAddress)

            requireUninterrupted()

            const newStream = await (() => {
                try {
                    return client.createStream(params)
                } catch (e) {
                    if (e.code === 'DUPLICATE_NOT_ALLOWED') {
                        throw new DuplicateError()
                    }

                    throw e
                }
            })()

            requireUninterrupted()

            dispatch({
                type: Init,
                payload: newStream,
            })

            return newStream
        } finally {
            requireUninterrupted()

            dispatch({
                type: SetBusy,
                payload: false,
            })
        }
    }, [itp, client])

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp])

    const value = useMemo(() => ({
        commit,
        discard: () => void dispatch({
            type: Reset,
        }),
        stage: (change) => void dispatch({
            type: Modify,
            payload: change,
        }),
    }), [commit])

    const status = useMemo(() => ({
        busy,
        clean,
    }), [busy, clean])

    return (
        <StreamModifierContext.Provider value={value}>
            <StreamContext.Provider value={modifiedStream}>
                <StreamModifierStatusContext.Provider value={status}>
                    <ValidationErrorProvider>
                        {children}
                    </ValidationErrorProvider>
                    <ConfirmExitModal />
                    <ChangeLossWatcher />
                </StreamModifierStatusContext.Provider>
            </StreamContext.Provider>
        </StreamModifierContext.Provider>
    )
}
