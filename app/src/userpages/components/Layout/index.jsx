// @flow

import React, { type Node } from 'react'

import Layout from '$mp/components/Layout'
import Header from '../Header'

type Props = {
    children: Node,
    headerAdditionalComponent?: Node,
    headerSearchComponent?: Node,
    headerFilterComponent?: Node,
}

const UserpagesLayout = (props: Props) => (
    <Layout>
        <Header
            additionalComponent={props.headerAdditionalComponent}
            searchComponent={props.headerSearchComponent}
            filterComponent={props.headerFilterComponent}
        />
        <React.Fragment>
            {props.children}
        </React.Fragment>
    </Layout>
)

export default UserpagesLayout
