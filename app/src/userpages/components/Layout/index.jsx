// @flow

import React, { Component, type Node } from 'react'
import cx from 'classnames'

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

type State = {}

class UserpagesLayout extends Component<Props, State> {
    static defaultProps = {
        noHeader: false,
        loading: false,
    }

    componentDidMount() {
        this.toggleAlwaysOnScrollbar(true)
    }

    componentWillUnmount() {
        this.toggleAlwaysOnScrollbar(false)
    }

    toggleAlwaysOnScrollbar = (setting: boolean) => {
        if (document.body) {
            if (setting) {
                // $FlowFixMe
                document.getElementsByTagName('body')[0].style['overflow-y'] = 'scroll'
            } else {
                // $FlowFixMe
                document.getElementsByTagName('body')[0].style['overflow-y'] = null
            }
        }
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
            <Layout footer={false} className={cx(styles.container, styles.tabletContainer)}>
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
