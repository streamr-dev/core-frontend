// @flow

import React, { useCallback } from 'react'
import { Container } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

import routes from '$routes'
import type { ProductType } from '$mp/flowtype/product-types'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'

import styles from './createProductPage.pcss'

const CreateProductPage = () => {
    const dispatch = useDispatch()

    const onTypeSelect = useCallback((type: ProductType) => {
        console.log(type)

        // TODO: here we'd call API first and then do the redirect with new product id
        dispatch(push(routes.editProduct2({
            id: '123',
        })))
    }, [dispatch])

    return (
        <div className={styles.root}>
            <Container className={styles.container}>
                <ProductTypeChooser onSelect={onTypeSelect} />
            </Container>
        </div>
    )
}

export default CreateProductPage
