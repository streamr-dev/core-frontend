import React, { FunctionComponent, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './emptyState.pcss'
type Props = {
    image?: ReactNode
    children: ReactNode | ReactNode[]
    className?: string
    link?: ReactNode
    linkOnMobile?: boolean
}

const EmptyState: FunctionComponent<Props> = ({
    children,
    image,
    className,
    link,
    linkOnMobile,
}: Props) => (
    <div className={classNames(className, styles.emptyState)}>
        {image && <div className={styles.imageWrapper}>{image}</div>}
        {children}
        {!!link && (
            <div
                className={classNames(styles.linkWrapper, {
                    'd-none d-md-block': !linkOnMobile,
                })}
            >
                {link}
            </div>
        )}
    </div>
)

export default EmptyState
