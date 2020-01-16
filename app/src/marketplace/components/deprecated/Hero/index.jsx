// @flow

import * as React from 'react'
import cx from 'classnames'
import ProductContainer from '$shared/components/Container/Product'

import styles from './hero_deprecated.pcss'

type Props = {
    leftContent: React.Node,
    rightContent: React.Node,
    className?: string,
    containerClassName?: string,
}

const Hero = ({ leftContent, rightContent, containerClassName, className }: Props) => (
    <div className={cx(styles.hero, className)}>
        <ProductContainer className={cx(styles.container, containerClassName)}>
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
