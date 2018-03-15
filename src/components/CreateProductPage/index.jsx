// @flow

import React from 'react'
import { Container, Button } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'

import ProductBasics from './ProductBasics'
import AddStreams from './AddStreams'
import PriceAndPayments from './PriceAndPayments'

import type { Props as ProductBasicsProps } from './ProductBasics'
import type { Props as AddStreamsProps } from './AddStreams'
import type { Props as PriceAndPaymentsProps } from './PriceAndPayments'
import styles from './createproductpage.pcss'

import links from '../../links'

export type Props = ProductBasicsProps & AddStreamsProps & PriceAndPaymentsProps & {
    onCancel: () => void,
}

const CreateProductPage = (props: Props) => (
    <div className={styles.createProductPage}>
        <Container>
            <h1>Create product</h1>

            <ProductBasics {...props} />
            <hr />
            <AddStreams {...props} />
            <hr />
            <PriceAndPayments {...props} />

            <Button onClick={() => props.onCancel()}>Cancel</Button>
            <Button color="primary" tag={Link} to={links.createProductPreview}>Preview</Button>
        </Container>
    </div>
)

export default CreateProductPage
