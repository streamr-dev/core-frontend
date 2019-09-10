// @flow

import React, { useContext, useCallback } from 'react'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import routes from '$routes'
import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import SvgIcon from '$shared/components/SvgIcon'
import useModal from '$shared/hooks/useModal'

import useProduct from '../ProductController/useProduct'

import styles from './backButton.pcss'

type Props = {
    className?: string,
}

const BackButton = ({ className }: Props) => {
    const product = useProduct()
    const { api: confirmSaveDialog } = useModal('confirmSave')
    const { history } = useContext(RouterContext)

    const productId = product.id

    const redirectToProductPage = useCallback(() => {
        history.replace(routes.product({
            id: productId,
        }))
    }, [history, productId])

    const onClick = useCallback(async () => {
        const saveConfirmed = await confirmSaveDialog.open()

        if (saveConfirmed) {
            redirectToProductPage()
        }
    }, [confirmSaveDialog, redirectToProductPage])

    return (
        <div
            className={cx(styles.root, className)}
        >
            <button
                type="button"
                onClick={onClick}
                className={styles.button}
            >
                <SvgIcon name="back" className={styles.backIcon} />
                <span>
                    <Translate value="general.back" />
                </span>
            </button>
        </div>
    )
}

export default BackButton
