// @flow

import { useContext, useMemo } from 'react'

import { Context as ModalContext } from './Modal'

export default function useModal(modalId: string) {
    const { modals, openModal, closeModal } = useContext(ModalContext)

    const isOpen = !!modals[modalId]

    const value = isOpen && modals[modalId].value

    const api = useMemo(() => ({
        open: openModal.bind(null, modalId),
        close: closeModal.bind(null, modalId),
    }), [openModal, closeModal, modalId])

    return useMemo(() => ({
        modalId,
        isOpen,
        api,
        value,
    }), [value, modalId, isOpen, api])
}
