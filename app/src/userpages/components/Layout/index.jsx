// @flow

import React, { type Node } from 'react'

import Layout from '$mp/components/Layout'
import Header from '../Header'

type Props = {
    children: Node,
    headerAdditionalComponent?: Node,
    headerSearchComponent?: Node,
    headerFilterComponent?: Node,
    noHeader?: boolean,
}

const UserpagesLayout = (props: Props) => (
    <Layout>
        <Header
            additionalComponent={props.headerAdditionalComponent}
            searchComponent={props.headerSearchComponent}
            filterComponent={props.headerFilterComponent}
            noHeader={props.noHeader}
        />
        <React.Fragment>
            {props.children}
        </React.Fragment>
    </Layout>
)

UserpagesLayout.defaultProps = {
    noHeader: false,
}

export default UserpagesLayout
