// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './emptyState.pcss'

type Props = {
    image?: Node,
    children: Node,
    className?: string,
    link?: Node,
    linkOnMobile?: boolean,
}

const EmptyState = ({
    children,
    image,
    className,
    link,
    linkOnMobile,
}: Props) => (
    <div className={classNames(className, styles.emptyState)}>
        {image && (
            <div className={styles.imageWrapper}>
                {image}
            </div>
        )}
        {children}
        {!!link && (
            <div className={classNames(styles.linkWrapper, {
                'd-none d-md-block': !linkOnMobile,
            })}
            >
                {link}
            </div>
        )}
    </div>
)

export default EmptyState
