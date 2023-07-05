import React, { FunctionComponent, ReactNode } from 'react'
import cx from 'classnames'
import Layout from '~/shared/components/Layout/index'
import styles from './core.pcss'
type Props = {
    children?: ReactNode
    className?: string
    contentClassname?: string
    navComponent?: ReactNode
    nav?: ReactNode
}

const CoreLayout: FunctionComponent<Props> = ({
    children,
    className,
    contentClassname,
    navComponent,
    nav,
}: Props) => (
    <Layout footer={false} className={cx(styles.container, className)} nav={nav}>
        {navComponent || null}
        <div className={cx(styles.content, contentClassname)}>{children || null}</div>
    </Layout>
)

export default CoreLayout
