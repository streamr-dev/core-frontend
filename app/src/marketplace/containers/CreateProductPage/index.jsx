// @flow

import React, { useCallback } from 'react'
import { Container } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

import routes from '$routes'
import type { ProductType } from '$mp/flowtype/product-types'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import { postEmptyProduct } from '$mp/modules/editProduct/services'

import styles from './createProductPage.pcss'

const CreateProductPage = () => {
    const dispatch = useDispatch()

    const createProduct = useCallback(async (type: ProductType) => {
        try {
            const product = await postEmptyProduct(type)
            dispatch(push(routes.editProduct2({
                id: product.id,
            })))
        } catch (err) {
            console.error('Could not create an empty product', err)
        }
    }, [dispatch])

    const onTypeSelect = useCallback((type: ProductType) => {
        createProduct(type)
    }, [])

    return (
        <div className={styles.root}>
            <Container className={styles.container}>
                <ProductTypeChooser onSelect={onTypeSelect} />
            </Container>
        </div>
    )
}

export default CreateProductPage
