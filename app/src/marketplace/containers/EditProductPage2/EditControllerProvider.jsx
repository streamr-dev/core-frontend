// @flow

import React, { type Node, type Context, useState, useMemo, useCallback, useContext } from 'react'

import type { Product } from '$mp/flowtype/product-types'

import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'

export const editorStates = {
    EDIT: 'edit',
    CONFIRM_NO_COVER_IMAGE: 'confirmNocoverImage',
    SAVE: 'save',
}

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    editorState: $Keys<typeof editorStates>,
    save: () => void | Promise<void>,
    cancel: () => void,
    modal?: {
        id: string,
        save: () => void | Promise<void>,
        close: () => void,
    } | null,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const [editorState, setEditorState]: [any, (any) => void] = useState(editorStates.EDIT)
    const [isPreview, setIsPreview] = useState(false)
    const [modal, setModal] = useState(null)

    const closeModal = useCallback(() => {
        setModal(null)
    }, [setModal])

    const showModal = useCallback(async (id, save) => {
        await new Promise((resolve) => {
            setModal({
                id,
                save: () => {
                    save()
                    resolve()
                },
                close: () => {
                    resolve()
                    closeModal()
                },
            })
        })
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

    /* const saveFn = useMemo(() => {
        if (editorState === editorStates.EDIT) {
            return ({ product: p }) => {
                if (!p.imageUrl) {
                    setEditorState(editorStates.CONFIRM_NO_COVER_IMAGE)
                } else {
                    setEditorState(editorStates.SAVE)
                }
            }
        }

        if (editorState === editorStates.CONFIRM_NO_COVER_IMAGE) {
            return () => {
                setEditorState(editorStates.SAVE)
            }
        }

        if (editorState === editorStates.SAVE) {
            return () => {
                alert('save')
            }
        }

        throw new Error('unknow state!')
    }, [editorState])

    const saveX = useCallback(() => {
        // $FlowFixMe
        saveFn({
            product,
            errors,
        })
    }, [saveFn, product, errors])
    */

    const save = useCallback(async () => {
        if (errors.length > 0) {
            console.log(errors)
        } else if (!product.imageUrl) {
            /* const x = new Promise((resolve) => {
                showModal('confirm', async () => {
                    closeModal()
                    resolve()
                })
            })

            await x */
            await showModal('confirm', () => {
                closeModal()
            })
            alert('moi')
        }
    }, [errors, product, closeModal])

    const cancel = useCallback(() => setEditorState(editorStates.EDIT), [setEditorState])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        editorState,
        save,
        cancel,
        modal,
    }), [
        isPreview,
        setIsPreview,
        editorState,
        save,
        cancel,
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
