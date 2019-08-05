// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './product.pcss'

type Props = {
    className?: string,
    children?: Node,
}

const Product = ({ className, children, ...props }: Props) => (
    <div className={cx(styles.root, styles.ProductContainer, className)} {...props}>
        {children}
    </div>
)

export default Product
