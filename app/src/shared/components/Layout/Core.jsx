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
}

const CoreLayout = ({ loading, children, className }: Props) => (
    <Layout footer={false} className={cx(styles.container, className)}>
        <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
        <div className={styles.content}>
            {children}
        </div>
    </Layout>
)

export default CoreLayout
