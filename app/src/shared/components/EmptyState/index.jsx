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
        <p>{children}</p>
        {!!link && (
            <div className={classNames(styles.linkWrapper, {
                'hidden-sm-down': !linkOnMobile,
            })}
            >
                {link}
            </div>
        )}
    </div>
)

export default EmptyState
