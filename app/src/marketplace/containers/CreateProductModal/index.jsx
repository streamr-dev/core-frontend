// @flow

import React, { useCallback } from 'react'

import useModal from '$shared/hooks/useModal'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './createProductModal.pcss'

type Props = {
    api: Object,
}

const CreateProductModal = ({ api }: Props) => {
    const onClose = useCallback(() => {
        api.close()
    }, [api])

    return (
        <ModalPortal>
            <ModalDialog onClose={onClose}>
                <div className={styles.root}>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        <SvgIcon name="crossMedium" />
                    </button>
                    <ProductTypeChooser
                        className={styles.chooser}
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
