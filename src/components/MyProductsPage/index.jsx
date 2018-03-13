// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@streamr/streamr-layout'

import styles from './myproductspage.pcss'
import links from '../../links.json'

const MyProductsPage = () => (
    <div className={styles.myProductsPage}>
        <Container>
            <h1>My Products</h1>

            <Link to={links.createProduct}>Create Product</Link>
        </Container>
    </div>
)

export default MyProductsPage
