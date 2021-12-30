// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Layout from '$shared/components/Layout'

import styles from './core.pcss'

type Props = {
    children?: Node,
    className?: string,
    contentClassname?: string,
    navComponent?: Node,
    nav?: Node,
}

const CoreLayout = ({
    children,
    className,
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
        <div className={cx(styles.content, contentClassname)}>
            {children || null}
        </div>
    </Layout>
)

export default CoreLayout
