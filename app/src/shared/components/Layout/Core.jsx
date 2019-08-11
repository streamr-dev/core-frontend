// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Layout from '$shared/components/Layout'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import styles from './core.pcss'

type Props = {
    children: Node,
    loading?: boolean,
    className?: string,
    navComponent?: Node,
    hideNavOnDesktop?: boolean,
}

const CoreLayout = ({
    loading,
    children,
    className,
    navComponent,
    hideNavOnDesktop,
}: Props) => (
    <Layout
        footer={false}
        className={cx(styles.container, className)}
        hideNavOnDesktop={hideNavOnDesktop}
    >
        {navComponent || null}
        <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
        <div className={styles.content}>
            {children || null}
        </div>
    </Layout>
)

export default CoreLayout
