// @flow

import React, { type Context, type Node, useState, useCallback, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import useIsMounted from '$shared/hooks/useIsMounted'

type ContextProps = {
    modals: Object,
    openModal: Function,
    closeModal: Function,
}

const ModalContext: Context<ContextProps> = React.createContext({})

function useModalContext(path: string): ContextProps {
    const [modals, setModals] = useState({})

    const isMounted = useIsMounted()

    const openModal = useCallback((modalId: string, value: any = true): Promise<any> => {
        if (!isMounted()) { return Promise.resolve() }

        if (modals[modalId] && typeof modals[modalId].reject === 'function') {
            modals[modalId].reject()
        }

        return new Promise((resolve, reject) => {
            setModals(({ modals: prevModals }) => ({
                ...prevModals,
                [modalId]: {
                    resolve,
                    reject,
                    value,
                },
            }))
        })
    }, [modals, isMounted])

    const closeModal = useCallback((modalId: string, value = undefined): void => {
        if (!isMounted()) { return }

        if (modals[modalId] && typeof modals[modalId].resolve === 'function') {
            modals[modalId].resolve(value)
        }

        setModals(({ modals: prevModals }) => {
            const nextModals = {
                ...prevModals,
            }
            delete nextModals[modalId]

            return nextModals
        })
    }, [modals, isMounted])

    // close all modals on route change
    useEffect(() => () => {
        if (!isMounted()) { return }

        setModals((prevModals) => {
            Object.keys(prevModals).forEach((modalId) => {
                if (prevModals[modalId].reject && typeof prevModals[modalId].reject === 'function') {
                    prevModals[modalId].reject()
                }
            })
            return {}
        })
    }, [isMounted, path])

    return useMemo(() => ({
        modals,
        openModal,
        closeModal,
    }), [modals, openModal, closeModal])
}

type Props = {
    children?: Node,
}

const ModalContextProvider = ({ children }: Props) => {
    const { pathname } = useLocation()

    return (
        <ModalContext.Provider value={useModalContext(pathname)}>
            {children || null}
        </ModalContext.Provider>
    )
}

export {
    ModalContextProvider as Provider,
    ModalContext as Context,
}
