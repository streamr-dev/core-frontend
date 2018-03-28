// @flow

import React from 'react'
import PropTypes from 'prop-types'
import getWeb3 from '../../web3/web3Provider'

type Props = {
    children?: React$Node,
}

type State = {
    account: any,
    accountsError: any,
}

class Web3Provider extends React.Component<Props, State> {
    interval: any

    constructor(props: Props, context: any) {
        super(props, context)

        this.state = {
            account: null,
            accountsError: null,
        }

        this.interval = null
    }

    static contextTypes = {
        store: PropTypes.object
    }

    componentDidMount() {
        this.fetchAccounts()
        this.initPoll()
    }

    initPoll() {
        if (!this.interval) {
            this.interval = setInterval(this.fetchAccounts.bind(this), 1000)
        }
    }

    fetchAccounts() {
        const web3 = getWeb3()

        web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account)
            })
            .catch((err) => {
                this.setState({
                    accountsError: err
                })
            })
    }

    handleAccount(account: string, isConstructor: boolean = false) {
        const { store } = this.context
        let next = account
        let curr = this.state.account
        next = next && next.toLowerCase()
        curr = curr && curr.toLowerCase()

        const didChange = curr && next && (curr !== next)

        if (!this.state.accounts && account) {
            this.setState({
                accountsError: null,
                account,
            })
        }

        if ((!curr || didChange) && !isConstructor) {
            this.setState({
                accountsError: null,
                account
            })
        }

        // If available, dispatch redux action
        if (store && typeof store.dispatch === 'function') {
            const didDefine = !curr && next

            if (didDefine || (isConstructor && next)) {
                store.dispatch({
                    type: 'web3/RECEIVE_ACCOUNT',
                    address: next
                })
            } else if (didChange) {
                store.dispatch({
                    type: 'web3/CHANGE_ACCOUNT',
                    address: next
                })
            }
        }
    }

    render() {
        return this.props.children
    }
}

export default Web3Provider
