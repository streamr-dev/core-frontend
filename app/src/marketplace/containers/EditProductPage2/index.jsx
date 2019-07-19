// @flow

import React, { useContext } from 'react'
import { Container } from 'reactstrap'

import RouterContextProvider from '$shared/components/RouterContextProvider'
import RouterContext from '$shared/contexts/Router'

import styles from './editProductPage.pcss'

const EditProductPage = () => {
    const { match } = useContext(RouterContext)
    console.log(match)

    return (
        <div className={styles.root}>
            <Container className={styles.container}>
                New product editor...
            </Container>
        </div>
    )
}

export default () => (
    <RouterContextProvider>
        <EditProductPage />
    </RouterContextProvider>
)
