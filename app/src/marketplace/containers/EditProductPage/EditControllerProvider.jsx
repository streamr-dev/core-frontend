// @flow

import React, { type Node, type Context, useEffect, useState, useMemo, useCallback, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { Context as RouterContext } from '$shared/contexts/Router'
import { Context as ValidationContext, ERROR } from '../ProductController/ValidationContextProvider'
import type { Product } from '$mp/flowtype/product-types'
import { isDataUnionProduct } from '$mp/utils/product'
import usePending from '$shared/hooks/usePending'
import { putProduct, postImage } from '$mp/modules/product/services'
import { selectDataUnion } from '$mp/modules/dataUnion/selectors'
import { selectProduct } from '$mp/modules/product/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { NotificationIcon, productStates, contractCurrencies as currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import routes from '$routes'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { isEthereumAddress } from '$mp/utils/validate'
import { areAddressesEqual } from '$mp/utils/smartContract'
import useEditableProductUpdater from '../ProductController/useEditableProductUpdater'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'

import * as State from '../EditProductPage/state'
import useModal from '$shared/hooks/useModal'

type ContextProps = {
    isPreview: boolean,
    setIsPreview: (boolean | Function) => void,
    validate: () => boolean,
    back: () => void | Promise<void>,
    save: () => void | Promise<void>,
    publish: () => void | Promise<void>,
    deployDataUnion: () => void | Promise<void>,
    lastSectionRef: any,
    publishAttempted: boolean,
    preferredCurrency: $Values<typeof currencies>,
    setPreferredCurrency: ($Values<typeof currencies>) => void,
}

const EditControllerContext: Context<ContextProps> = React.createContext({})

function useEditController(product: Product) {
    const { history } = useContext(RouterContext)
    const { isAnyTouched, resetTouched, status } = useContext(ValidationContext)
    const [isPreview, setIsPreview] = useState(false)
    // lastSectionRef is stored here and set in EditorNav so it remembers its state when toggling
    // between editor and preview
    const lastSectionRef = useRef(undefined)
    const isMounted = useIsMounted()
    const savePending = usePending('product.SAVE')
    const { updateBeneficiaryAddress } = useEditableProductActions()
    const originalProduct = useSelector(selectProduct)
    const { replaceProduct } = useEditableProductUpdater()
    const dataUnion = useSelector(selectDataUnion)
    const [publishAttempted, setPublishAttempted] = useState(false)
    const [preferredCurrency, setPreferredCurrency] = useState(product.priceCurrency || DEFAULT_CURRENCY)

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

    const { api: deployDataUnionDialog } = useModal('dataUnion.DEPLOY')
    const { api: confirmSaveDialog } = useModal('confirmSave')
    const { api: publishDialog } = useModal('publish')

    const redirectToProductList = useCallback(() => {
        if (!isMounted()) { return }
        history.replace(routes.products.index())
    }, [
        isMounted,
        history,
    ])

    const productId = product.id
    const redirectToProduct = useCallback(() => {
        if (!isMounted()) { return }
        history.replace(routes.marketplace.product({
            id: productId,
        }))
    }, [
        productId,
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
                    /* eslint-disable object-curly-newline */
                    const {
                        imageUrl: newImageUrl,
                        thumbnailUrl: newThumbnailUrl,
                    } = await postImage(nextProduct.id || '', nextProduct.newImageToUpload)
                    /* eslint-enable object-curly-newline */
                    nextProduct.imageUrl = newImageUrl
                    nextProduct.thumbnailUrl = newThumbnailUrl
                    delete nextProduct.newImageToUpload

                    replaceProduct(() => nextProduct)
                } catch (e) {
                    console.error('Could not upload image', e)
                }
            }

            // save product (don't need to abort if unmounted)
            await putProduct(State.update(originalProduct, () => ({
                ...nextProduct,
            })), nextProduct.id || '')
            resetTouched()

            Activity.push({
                action: actionTypes.UPDATE,
                resourceId: nextProduct.id,
                resourceType: resourceTypes.PRODUCT,
            })

            // TODO: handle saving errors
            return true
        })

        // Everything ok, do a redirect back to product page
        if (savedSuccessfully && !!options.redirect) {
            redirectToProductList()
        }
    }, [
        savePending,
        redirectToProductList,
        originalProduct,
        replaceProduct,
        resetTouched,
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

        if (isDataUnionProduct(productRef.current) && dataUnion != null && dataUnion.memberCount != null) {
            const memberLimit = parseInt(process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT, 10) || 0
            if (dataUnion.memberCount.active < memberLimit) {
                Notification.push({
                    title: I18n.t('notifications.notEnoughMembers', {
                        memberLimit,
                    }),
                    icon: NotificationIcon.ERROR,
                })
                return false
            }
        }

        return true
    }, [errors, dataUnion])

    const publish = useCallback(async () => {
        setPublishAttempted(true)

        if (validate()) {
            await save({
                redirect: false,
            })

            const { isUnpublish, started, succeeded, showPublishedProduct } = await publishDialog.open({
                product: productRef.current,
            })

            if (!isMounted()) { return }

            if (started) {
                replaceProduct((prevProduct) => ({
                    ...prevProduct,
                    state: isUnpublish ? productStates.UNDEPLOYING : productStates.DEPLOYING,
                }))
            }

            if (succeeded && (isUnpublish || !showPublishedProduct)) {
                redirectToProductList()
            } else if (succeeded && showPublishedProduct) {
                redirectToProduct()
            }
        }
    }, [
        validate,
        save,
        publishDialog,
        redirectToProductList,
        redirectToProduct,
        replaceProduct,
        isMounted,
    ])

    const updateBeneficiary = useCallback(async (address) => {
        const { beneficiaryAddress } = productRef.current
        if (!!address && isEthereumAddress(address) && (!beneficiaryAddress || !areAddressesEqual(beneficiaryAddress, address))) {
            updateBeneficiaryAddress(address)
        }
    }, [updateBeneficiaryAddress])

    const deployDataUnion = useCallback(async () => {
        setPublishAttempted(true)

        if (validate()) {
            await save({
                redirect: false,
            })
            const dataUnionCreated = await deployDataUnionDialog.open({
                product: productRef.current,
                updateAddress: updateBeneficiary,
            })

            // TODO: doesn't save unless dialog closed
            if (dataUnionCreated) {
                await save()
            }
        }
    }, [
        validate,
        deployDataUnionDialog,
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
            redirectToProductList()
        }
    }, [
        isAnyTouched,
        confirmSaveDialog,
        save,
        redirectToProductList,
    ])

    return useMemo(() => ({
        isPreview,
        setIsPreview,
        validate,
        back,
        save,
        publish,
        deployDataUnion,
        lastSectionRef,
        publishAttempted,
        preferredCurrency,
        setPreferredCurrency,
    }), [
        isPreview,
        setIsPreview,
        validate,
        back,
        save,
        publish,
        deployDataUnion,
        lastSectionRef,
        publishAttempted,
        preferredCurrency,
        setPreferredCurrency,
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
