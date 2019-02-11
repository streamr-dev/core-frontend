// @flow

import React, { type Node } from 'react'

import Layout from '$mp/components/Layout'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import Header from '../Header'

import styles from './layout.pcss'

type Props = {
    children: Node,
    headerAdditionalComponent?: Node,
    headerSearchComponent?: Node,
    headerFilterComponent?: Node,
    noHeader?: boolean,
    loading?: boolean,
}

const UserpagesLayout = (props: Props) => (
    <Layout>
        <Header
            additionalComponent={props.headerAdditionalComponent}
            searchComponent={props.headerSearchComponent}
            filterComponent={props.headerFilterComponent}
            noHeader={props.noHeader}
        />
        <div className={styles.content}>
            <LoadingIndicator loading={!!props.loading} className={styles.loadingIndicator} />
            {props.children}
        </div>
    </Layout>
)

UserpagesLayout.defaultProps = {
    noHeader: false,
    loading: false,
}

export default UserpagesLayout
