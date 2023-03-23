import { Node } from 'react'
import React from 'react'
import cx from 'classnames'
import styles from './details.pcss'
type Props = {
    className?: string
    children?: Node
}

const Details = ({ className, children, ...props }: Props) => (
    <div {...props} className={cx(styles.root, styles.DetailsContainer, className)}>
        {children}
    </div>
)

export default Details
