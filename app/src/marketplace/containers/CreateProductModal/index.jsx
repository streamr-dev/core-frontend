// @flow

import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

import useModal from '$shared/hooks/useModal'
import type { ProductType } from '$mp/flowtype/product-types'
import { postEmptyProduct } from '$mp/modules/deprecated/editProduct/services'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import SvgIcon from '$shared/components/SvgIcon'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import useIsMounted from '$shared/hooks/useIsMounted'
import routes from '$routes'

import styles from './createProductModal.pcss'

type Props = {
    api: Object,
}

const CreateProductModal = ({ api }: Props) => {
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const [processing, setProcessing] = useState(false)

    const onClose = useCallback(() => {
        api.close()
    }, [api])

    const createProduct = useCallback(async (type: ProductType) => {
        setProcessing(true)
        try {
            const product = await postEmptyProduct(type)

            if (isMounted()) {
                setProcessing(false)
                onClose()
                dispatch(push(routes.editProduct({
                    id: product.id,
                })))
            }
        } catch (err) {
            console.error('Could not create an empty product', err)

            if (isMounted()) {
                setProcessing(false)
            }
        }
    }, [dispatch, isMounted, onClose])

    const onTypeSelect = useCallback((type: ProductType) => {
        createProduct(type)
    }, [createProduct])

    return (
        <ModalPortal>
            <ModalDialog onClose={onClose}>
                <div className={styles.root}>
                    <LoadingIndicator
                        className={styles.loadingIndicator}
                        loading={processing}
                    />
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        disabled={processing}
                    >
                        <SvgIcon name="crossMedium" />
                    </button>
                    <ProductTypeChooser
                        onSelect={onTypeSelect}
                        className={styles.chooser}
                        disabled={processing}
                    />
                </div>
            </ModalDialog>
        </ModalPortal>
    )
}

export default () => {
    const { api, isOpen } = useModal('marketplace.createProduct')

    if (!isOpen) {
        return null
    }

    return (
        <CreateProductModal
            api={api}
        />
    )
}
