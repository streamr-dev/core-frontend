// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import NoStreamsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import type { TransactionEntityList } from '$mp/flowtype/web3-types'

type StateProps = {
    fetching: boolean,
    transactions: TransactionEntityList,
}

type DispatchProps = {
    getTransactions: () => void,
}

type Props = StateProps & DispatchProps

class TransactionList extends Component<Props> {
    componentDidMount() {
        this.props.getTransactions()
    }

    render() {
        const { fetching, transactions } = this.props

        return (
            <Layout>
                <div className="container">
                    {!fetching && transactions && transactions.length <= 0 && (
                        <NoStreamsView />
                    )}
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = () => ({
    transactions: [],
    fetching: false,
})

const mapDispatchToProps = () => ({
    getTransactions: () => {},
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
