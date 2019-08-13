// @flow

import React, { type Node, type Context, useState, useMemo, useCallback, useContext } from 'react'

import type { Product } from '$mp/flowtype/product-types'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import usePending from '$shared/hooks/usePending'
import { putProduct } from '$mp/modules/editProduct/services'

import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    isSaving: boolean,
    save: () => void | Promise<void>,
    modal?: {
        id: string,
        save: () => void | Promise<void>,
        cancel: () => void,
    } | null,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const [isSaving, setIsSaving] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const [modal, setModal] = useState(null)
    const savePending = usePending('product.SAVE')

    const closeModal = useCallback(() => {
        setModal(null)
    }, [setModal])

    const showConfirmModal = useCallback(async () => {
        const result = await new Promise((resolve) => setModal({
            id: 'confirm',
            save: () => {
                resolve(true)
                closeModal()
            },
            cancel: () => {
                resolve(false)
                closeModal()
            },
        }))

        return result
    }, [setModal, closeModal])

    const { status } = useContext(ValidationContext)

    const errors = useMemo(() => (
        Object.keys(status)
            .filter((key) => status[key] && status[key].level === ERROR)
            .map((key) => ({
                key,
                message: status[key].message,
            }))
    ), [status])

    const save = useCallback(async () => {
        setIsSaving(true)

        // Notify missing fields
        if (errors.length > 0) {
            errors.forEach(({ message }) => {
                Notification.push({
                    title: message,
                    icon: NotificationIcon.ERROR,
                })
            })

            setIsSaving(false)
        } else if (!product.imageUrl) {
            // confirm missing cover image
            const accepted = await showConfirmModal()

            if (accepted) {
                // do actual asaving
                savePending.wrap(async () => {
                    // save product
                    await putProduct(product, product.id || '')

                    // TODO: upload image

                    // TODO: check contract product for price change (if published)
                    setIsSaving(false)
                })
            } else {
                setIsSaving(false)
            }
        }
    }, [errors, product, showConfirmModal, savePending])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        isSaving,
        save,
        modal,
    }), [
        isPreview,
        setIsPreview,
        isSaving,
        save,
        modal,
    ])
}

type ControllerProps = {
    children?: Node,
    product: Product,
}

function EditControllerProvider({ children, product }: ControllerProps) {
    return (
        <EditControllerContext.Provider value={useEditController(product)}>
            {children || null}
        </EditControllerContext.Provider>
    )
}

export {
    EditControllerContext as Context,
    EditControllerProvider as Provider,
}
