// @flow

import React, { type Node } from 'react'

import Layout from '$mp/components/Layout'
import Header from '../Header'

type Props = {
    children: Node,
}

const UserpagesLayout = (props: Props) => (
    <Layout>
        <Header />
        <React.Fragment>
            {props.children}
        </React.Fragment>
    </Layout>
)

export default UserpagesLayout
