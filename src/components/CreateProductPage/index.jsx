// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'

import ProductBasics from './ProductBasics'
import AddStreams from './AddStreams'
import PriceAndPayments from './PriceAndPayments'

import type { Props as ProductBasicsProps } from './ProductBasics'
import type { Props as AddStreamsProps } from './AddStreams'

import styles from './createproductpage.pcss'

export type Props = ProductBasicsProps & AddStreamsProps

const CreateProductPage = (props: Props) => (
    <div className={styles.createProductPage}>
        <Container>
            <h1>Create product</h1>

            <ProductBasics {...props} />
            <AddStreams {...props} />
            <PriceAndPayments />
        </Container>
    </div>
)

export default CreateProductPage
