// @flow

import React, { type Node, type Context, useEffect, useState, useMemo, useCallback, useContext, useRef } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'
import type { Product } from '$mp/flowtype/product-types'
import usePending from '$shared/hooks/usePending'
import { putProduct, postImage } from '$mp/modules/editProduct/services'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import routes from '$routes'
import useProductActions from '../ProductController/useProductActions'
import { isEthereumAddress } from '$mp/utils/validate'
import { areAddressesEqual } from '$mp/utils/smartContract'

import useOriginalProduct from '../ProductController/useOriginalProduct'

import * as State from '../EditProductPage2/state'
import useModal from '$shared/hooks/useModal'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    back: () => void | Promise<void>,
    save: () => void | Promise<void>,
    publish: () => void | Promise<void>,
    deployCommunity: () => void | Promise<void>,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const { history } = useContext(RouterContext)
    const { isAnyTouched, status } = useContext(ValidationContext)
    const [isPreview, setIsPreview] = useState(false)
    const isMounted = useIsMounted()
    const savePending = usePending('product.SAVE')
    const { updateBeneficiaryAddress } = useProductActions()
    const originalProduct = useOriginalProduct()

    useEffect(() => {
        const handleBeforeunload = (event) => {
            if (isAnyTouched()) {
                const confirmationMessage = 'You have unsaved changes'
                const evt = (event || window.event)
                evt.returnValue = confirmationMessage // Gecko + IE
                return confirmationMessage // Webkit, Safari, Chrome etc.
            }
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeunload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload)
        }
    }, [isAnyTouched])
    const productRef = useRef(product)
    productRef.current = product

    const errors = useMemo(() => (
        Object.keys(status)
            .filter((key) => status[key] && status[key].level === ERROR)
            .map((key) => ({
                key,
                message: status[key].message,
            }))
    ), [status])

    useEffect(() => {
        const handleBeforeunload = (event) => {
            if (isAnyTouched()) {
                const confirmationMessage = 'You have unsaved changes'
                const evt = (event || window.event)
                evt.returnValue = confirmationMessage // Gecko + IE
                return confirmationMessage // Webkit, Safari, Chrome etc.
            }
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeunload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload)
        }
    }, [isAnyTouched])

    const { api: deployCommunityDialog } = useModal('deployCommunity')
    const { api: confirmSaveDialog } = useModal('confirmSave')
    const { api: publishDialog } = useModal('publish')

    const redirectToProduct = useCallback(() => {
        if (!isMounted()) { return }
        history.replace(routes.product({
            id: productRef.current.id,
        }))
    }, [
        isMounted,
        history,
    ])

    const save = useCallback(async (options = {
        redirect: true,
    }) => {
        if (!originalProduct) { throw new Error('originalProduct is missing') }
        const savedSuccessfully = await savePending.wrap(async () => {
            const nextProduct = {
                ...productRef.current,
            }

            // upload image
            if (nextProduct.newImageToUpload != null) {
                try {
                    const { imageUrl: newImageUrl, thumbnailUrl: newThumbnailUrl } = await postImage(nextProduct.id || '', nextProduct.newImageToUpload)
                    nextProduct.imageUrl = newImageUrl
                    nextProduct.thumbnailUrl = newThumbnailUrl
                    delete nextProduct.newImageToUpload
                } catch (e) {
                    console.error('Could not upload image', e)
                }
            }

            // save product
            await putProduct(State.update(originalProduct, () => ({
                ...nextProduct,
            })), nextProduct.id || '')

            // TODO: handle saving errors
            return true
        })

        // Everything ok, do a redirect back to product page
        if (savedSuccessfully && !!options.redirect) {
            redirectToProduct()
        }
    }, [
        savePending,
        redirectToProduct,
        originalProduct,
    ])

    const validate = useCallback(() => {
        // Notify missing fields
        if (errors.length > 0) {
            errors.forEach(({ message }) => {
                Notification.push({
                    title: message,
                    icon: NotificationIcon.ERROR,
                })
            })

            return false
        }

        return true
    }, [errors])

    const publish = useCallback(async () => {
        if (validate()) {
            await save({
                redirect: false,
            })
            await publishDialog.open({
                product: productRef.current,
            })

            // TODO: just redirect for now, need to check result for smarter handling
            redirectToProduct()
        }
    }, [validate, save, publishDialog, redirectToProduct])

    const updateBeneficiary = useCallback(async (address) => {
        const { beneficiaryAddress } = productRef.current
        if (!!address && isEthereumAddress(address) && (!beneficiaryAddress || !areAddressesEqual(beneficiaryAddress, address))) {
            updateBeneficiaryAddress(address)
        }
    }, [updateBeneficiaryAddress])

    const deployCommunity = useCallback(async () => {
        await save({
            redirect: false,
        })
        const communityCreated = await deployCommunityDialog.open({
            product: productRef.current,
            updateAddress: updateBeneficiary,
        })

        // TODO: doesn't save unless dialog closed
        if (communityCreated) {
            await save()
        }
    }, [
        deployCommunityDialog,
        save,
        updateBeneficiary,
    ])

    const back = useCallback(async () => {
        let doSave = isAnyTouched()
        let doRedirect = true

        if (doSave) {
            const { save: saveRequested, redirect: redirectRequested } = await confirmSaveDialog.open()

            doSave = saveRequested
            doRedirect = redirectRequested
        }

        if (doSave) {
            await save({
                redirect: doRedirect,
            })
        } else if (doRedirect) {
            redirectToProduct()
        }
    }, [
        isAnyTouched,
        confirmSaveDialog,
        save,
        redirectToProduct,
    ])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        back,
        save,
        publish,
        deployCommunity,
    }), [
        isPreview,
        setIsPreview,
        back,
        save,
        publish,
        deployCommunity,
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
