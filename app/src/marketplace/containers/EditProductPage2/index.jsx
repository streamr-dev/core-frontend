// @flow

import React, { useContext } from 'react'
import { Container } from 'reactstrap'

import * as RouterContext from '$shared/components/RouterContextProvider'

import styles from './editProductPage.pcss'

const EditProductPage = () => {
    const { match } = useContext(RouterContext.Context)
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
    <RouterContext.Provider>
        <EditProductPage />
    </RouterContext.Provider>
)
