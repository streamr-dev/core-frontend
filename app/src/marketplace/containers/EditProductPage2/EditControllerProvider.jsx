// @flow

import React, { type Node, type Context, useEffect, useState, useMemo, useCallback, useContext } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import type { Product } from '$mp/flowtype/product-types'
import usePending from '$shared/hooks/usePending'
import { putProduct, postImage } from '$mp/modules/editProduct/services'
import useIsMounted from '$shared/hooks/useIsMounted'
import routes from '$routes'

import useProductActions from '../ProductController/useProductActions'
import useModal from '$shared/hooks/useModal'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    back: () => void | Promise<void>,
    save: () => void | Promise<void>,
    deployCommunity: () => void | Promise<void>,
    deployContract: () => void | Promise<void>,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const { history } = useContext(RouterContext)
    const { isAnyTouched } = useContext(ValidationContext)
    const [isPreview, setIsPreview] = useState(false)
    const isMounted = useIsMounted()
    const savePending = usePending('product.SAVE')
    const { updateBeneficiaryAddress } = useProductActions()

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
    const { api: deployContractDialog } = useModal('deployContract')
    const { api: confirmSaveDialog } = useModal('confirmSave')

    const productId = product.id
    const redirectToProduct = useCallback(() => {
        if (!isMounted()) { return }
        history.push(routes.product({
            id: productId,
        }))
    }, [
        productId,
        isMounted,
        history,
    ])

    const save = useCallback(async () => {
        const savedSuccessfully = await savePending.wrap(async () => {
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

            // TODO: handle saving errors
            return true
        })

        // Everything ok, do a redirect back to product page
        if (savedSuccessfully) {
            redirectToProduct()
        }
    }, [
        product,
        savePending,
        redirectToProduct,
    ])

    const deployContract = useCallback(async () => {
        await deployContractDialog.open({
            product,
        })
    }, [deployContractDialog, product])

    const deployCommunity = useCallback(async () => {
        if (!isMounted()) { return }

        const result = await deployCommunityDialog.open({
            product,
        })

        if (result && result.success && result.address) {
            updateBeneficiaryAddress(result.address)
            deployContract()
            const updatedProduct = {
                ...product,
                beneficiaryAddress: result.address,
            }
            await putProduct(updatedProduct, updatedProduct.id || '')
        }
    }, [
        deployCommunityDialog,
        isMounted,
        product,
        updateBeneficiaryAddress,
        deployContract,
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
            await save()
        }

        if (doRedirect) {
            redirectToProduct()
        }
    }, [
        isAnyTouched,
        confirmSaveDialog,
        save,
        redirectToProduct,
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
            await save()
        }

        if (doRedirect) {
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
        deployCommunity,
        deployContract,
    }), [
        isPreview,
        setIsPreview,
        back,
        save,
        deployCommunity,
        deployContract,
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
