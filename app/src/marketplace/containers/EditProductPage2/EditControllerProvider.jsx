// @flow

import React, { type Node, type Context, useState, useMemo, useCallback, useContext } from 'react'

import type { Product } from '$mp/flowtype/product-types'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import usePending from '$shared/hooks/usePending'
import { putProduct, postImage } from '$mp/modules/editProduct/services'

import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'
import useModal from './useModal'

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
    const savePending = usePending('product.SAVE')

    const { api: comfirmModal } = useModal('confirm')

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

        let doSave = true

        // Notify missing fields
        if (errors.length > 0) {
            errors.forEach(({ message }) => {
                Notification.push({
                    title: message,
                    icon: NotificationIcon.ERROR,
                })
            })

            doSave = false
        } else if (!product.imageUrl) {
            // confirm missing cover image
            doSave = await comfirmModal.open()
        }

        if (doSave) {
            // do actual saving
            savePending.wrap(async () => {
                // save product
                await putProduct(product, product.id || '')

                // upload image
                if (product.newImageToUpload != null) {
                    try {
                        await postImage(product.id || '', product.newImageToUpload)
                    } catch (e) {
                        console.error('Could not upload image', e)
                    }
                }

                // TODO: check contract product for price change (if published)
                setIsSaving(false)
            })
        } else {
            setIsSaving(false)
        }
    }, [errors, product, comfirmModal, savePending])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        isSaving,
        save,
    }), [
        isPreview,
        setIsPreview,
        isSaving,
        save,
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
