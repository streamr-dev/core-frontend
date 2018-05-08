// @flow

import React from 'react'
import styles from './productPageSpinner.pcss'

type Props = {
    className?: string,
}

const ProductPageSpinner = ({ className }: Props) => (
    <div className={className}>
        <div className={styles.spinner} />
    </div>
)

export default ProductPageSpinner
