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
    nav?: Node,
}

const CoreLayout = ({
    loading,
    children,
    className,
    loadingClassname,
    contentClassname,
    navComponent,
    nav,
}: Props) => (
    <Layout
        footer={false}
        className={cx(styles.container, className)}
        nav={nav}
    >
        {navComponent || null}
        <LoadingIndicator loading={!!loading} className={cx(styles.loadingIndicator, loadingClassname)} />
        <div className={cx(styles.content, contentClassname)}>
            {children || null}
        </div>
    </Layout>
)

export default CoreLayout
