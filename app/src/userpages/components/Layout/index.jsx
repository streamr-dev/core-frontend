// @flow

import React, { Component, type Node } from 'react'

import Layout from '$mp/components/Layout'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import BodyClass from '$shared/components/BodyClass'
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

type State = {}

class UserpagesLayout extends Component<Props, State> {
    static defaultProps = {
        noHeader: false,
        loading: false,
    }

    render() {
        const {
            headerAdditionalComponent,
            headerSearchComponent,
            headerFilterComponent,
            noHeader,
            loading,
            children,
        } = this.props
        return (
            <Layout footer={false} className={styles.container}>
                <BodyClass className="core" />
                <Header
                    additionalComponent={headerAdditionalComponent}
                    searchComponent={headerSearchComponent}
                    filterComponent={headerFilterComponent}
                    noHeader={noHeader}
                />
                <LoadingIndicator loading={!!loading} className={styles.loadingIndicator} />
                <div className={styles.content}>
                    {children}
                </div>
            </Layout>
        )
    }
}

export default UserpagesLayout
