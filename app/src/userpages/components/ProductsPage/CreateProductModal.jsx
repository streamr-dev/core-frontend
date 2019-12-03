// @flow

import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

import useModal from '$shared/hooks/useModal'
import type { ProductType } from '$mp/flowtype/product-types'
import { postEmptyProduct } from '$mp/modules/deprecated/editProduct/services'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import Modal from '$shared/components/Modal'
import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import SvgIcon from '$shared/components/SvgIcon'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import useIsMounted from '$shared/hooks/useIsMounted'
import routes from '$routes'

import styles from './createProductModal.pcss'

type Props = {
    api: Object,
}

const CreateProductPage = ({ api }: Props) => {
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const [creating, setCreating] = useState(false)

    const createProduct = useCallback(async (type: ProductType) => {
        setCreating(true)
        try {
            const product = await postEmptyProduct(type)

            if (isMounted()) {
                dispatch(push(routes.editProduct({
                    id: product.id,
                })))
            }
        } catch (err) {
            console.error('Could not create an empty product', err)
        }

        if (isMounted()) {
            setCreating(false)
        }
    }, [dispatch, isMounted])

    const onTypeSelect = useCallback((type: ProductType) => {
        createProduct(type)
    }, [createProduct])

    return (
        <Modal>
            <BodyClass className={NO_SCROLL} />
            <div className={styles.root}>
                <LoadingIndicator
                    className={styles.loadingIndicator}
                    loading={creating}
                />
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => api.close()}
                    disabled={creating}
                >
                    <SvgIcon name="crossMedium" />
                </button>
                <ProductTypeChooser
                    onSelect={onTypeSelect}
                    className={styles.chooser}
                    disabled={creating}
                />
            </div>
        </Modal>
    )
}

export default () => {
    const { api, isOpen } = useModal('createProduct')

    if (!isOpen) {
        return null
    }

    return (
        <CreateProductPage
            api={api}
        />
    )
}
