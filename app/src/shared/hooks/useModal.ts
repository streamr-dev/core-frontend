import { useContext, useMemo } from 'react'
import { Context as ModalContext } from '$shared/contexts/ModalApi'

type ModalResult = {
    modalId: string,
    isOpen: boolean,
    api: {
        open: (value?: object) => Promise<any>,
        close: (value) => void,
    },
    value: any,
}

export default function useModal(modalId: string): ModalResult {
    const { modals, openModal, closeModal } = useContext(ModalContext)
    const isOpen = !!modals[modalId]
    const value = isOpen && modals[modalId].value
    const api = useMemo(
        () => ({
            open: (values?: object) => openModal(modalId, values),
            close: (values: object) => closeModal(modalId, values),
        }),
        [openModal, closeModal, modalId],
    )
    return useMemo(
        () => ({
            modalId,
            isOpen,
            api,
            value,
        }),
        [value, modalId, isOpen, api],
    )
}
