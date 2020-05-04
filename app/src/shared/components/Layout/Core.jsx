// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Layout from '$shared/components/Layout'
import LoadingIndicator from '$shared/components/LoadingIndicator'

import styles from './core.pcss'

type Props = {
    children?: Node,
    loading?: boolean,
    className?: string,
    loadingClassname?: string,
    contentClassname?: string,
    navComponent?: Node,
    hideNavOnDesktop?: boolean,
}

const CoreLayout = ({
    loading,
    children,
    className,
    loadingClassname,
    contentClassname,
    navComponent,
    hideNavOnDesktop,
}: Props) => (
    <Layout
        footer={false}
        className={cx(styles.container, className)}
        hideNavOnDesktop={hideNavOnDesktop}
    >
        {navComponent || null}
        <LoadingIndicator loading={!!loading} className={cx(styles.loadingIndicator, loadingClassname)} />
        <div className={cx(styles.content, contentClassname)}>
            {children || null}
        </div>
    </Layout>
)

export default CoreLayout
