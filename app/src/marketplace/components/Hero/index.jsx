// @flow

import * as React from 'react'
import ProductContainer from '$shared/components/Container/Product'

import styles from './hero.pcss'

type Props = {
    leftContent: React.Node,
    rightContent: React.Node,
}

const Hero = ({ leftContent, rightContent }: Props) => (
    <div className={styles.hero}>
        <ProductContainer className={styles.container}>
            <div className={styles.leftColumn}>
                {leftContent}
            </div>
            <div className={styles.rightColumn}>
                {rightContent}
            </div>
        </ProductContainer>
    </div>
)

export default Hero
