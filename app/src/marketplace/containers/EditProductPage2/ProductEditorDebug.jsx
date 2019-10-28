// @flow

import React, { useState, useCallback, useContext } from 'react'
import cx from 'classnames'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import Toggle from '$shared/components/Toggle'
import { isCommunityProduct } from '$mp/utils/product'

import useProduct from '../ProductController/useProduct'
import useProductActions from '../ProductController/useProductActions'

import styles from './productEditorDebug.pcss'

const ProductEditorDebug = () => {
    const [minimized, setMinimized] = useState(true)

    const toggle = useCallback(() => {
        setMinimized((prev) => !prev)
    }, [setMinimized])

    const product = useProduct()
    const { updateType } = useProductActions()
    const { touched, pendingChanges } = useContext(ValidationContext)

    const isCommunity = isCommunityProduct(product)
    const onFixPriceChange = useCallback((checked) => {
        updateType(checked ? 'COMMUNITY' : 'NORMAL')
    }, [updateType])

    return (
        <div className={styles.root}>
            <button
                type="button"
                className={styles.title}
                onClick={toggle}
            >
                DEBUG
            </button>
            <div className={cx(styles.content, {
                [styles.minimized]: minimized,
            })}
            >
                Is Community Product? <Toggle
                    value={isCommunity}
                    onChange={onFixPriceChange}
                />
                product:<br />
                <pre className={styles.productData}>
                    {JSON.stringify(product, null, 2)}
                </pre>
                touched:<br />
                <pre className={styles.productData}>
                    {JSON.stringify(touched, null, 2)}
                </pre>
                pending:<br />
                <pre className={styles.productData}>
                    {JSON.stringify(pendingChanges, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default ProductEditorDebug
