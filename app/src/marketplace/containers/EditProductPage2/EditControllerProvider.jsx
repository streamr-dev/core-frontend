// @flow

import React, { type Node, type Context, useState, useMemo, useCallback, useContext } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import type { Product } from '$mp/flowtype/product-types'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import usePending from '$shared/hooks/usePending'
import { putProduct, postImage } from '$mp/modules/editProduct/services'
import { isPaidProduct } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'
import useIsMounted from '$shared/hooks/useIsMounted'
import links from '$mp/../links'
import { formatPath } from '$shared/utils/url'

import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'
import useOriginalProduct from '../ProductController/useOriginalProduct'
import useModal from './useModal'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    save: () => void | Promise<void>,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const { history } = useContext(RouterContext)
    const [isPreview, setIsPreview] = useState(false)
    const isMounted = useIsMounted()
    const savePending = usePending('product.SAVE')
    const contractSavePending = usePending('contractProduct.SAVE')

    const { originalProduct } = useOriginalProduct()
    const { api: confirmDialog } = useModal('confirm')
    const { api: updateContractDialog } = useModal('updateContract')

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
        if (!originalProduct) { throw new Error('originalProduct is missing') }

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
        } else if (!product.imageUrl && !product.newImageToUpload) {
            // confirm missing cover image
            doSave = await confirmDialog.open()
        }

        if (doSave) {
            // do actual saving
            let savedSuccessfully = await savePending.wrap(async () => {
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

                // TODO: check errors
                return true
            })

            // Check update for contract product
            if (savedSuccessfully) {
                savedSuccessfully = await contractSavePending.wrap(async () => {
                    // fetch contract product from public node to see if we need to update the contract product
                    let contractProduct

                    try {
                        contractProduct = await getProductFromContract(product.id || '', true)
                    } catch (e) {
                        console.warn(e)
                    }

                    // use original product to check if it was paid or not
                    if (!!contractProduct && isPaidProduct(originalProduct) && isUpdateContractProductRequired(contractProduct, product)) {
                        // start contract transaction dialog, this will take care of checking web3
                        // and fetching/updating the contract product
                        const contractUpdated = await updateContractDialog.open({
                            product,
                            originalProduct,
                            contractProduct,
                        })

                        return contractUpdated
                    }

                    return true
                })
            }

            // Everything ok, do a redirect back to product page
            if (savedSuccessfully) {
                if (!isMounted()) { return }
                history.replace(formatPath(links.marketplace.products, product.id))
            }
        }
    }, [
        errors,
        product,
        confirmDialog,
        updateContractDialog,
        savePending,
        contractSavePending,
        originalProduct,
        isMounted,
        history,
    ])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        save,
    }), [
        isPreview,
        setIsPreview,
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
