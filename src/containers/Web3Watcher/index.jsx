// @flow

import React from 'react'
import { connect } from 'react-redux'
import type { Store } from 'react-redux'

import getWeb3 from '../../web3/web3Provider'
import { selectAccount } from '../../modules/web3/selectors'
import { receiveAccount, changeAccount } from '../../modules/web3/actions'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'

type OwnProps = {
    children?: React$Node,
}

type StateProps = {
    account: any,
}

type DispatchProps = {
    receiveAccount: (account: Address) => void,
    changeAccount: (account: Address) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class Web3Watcher extends React.Component<Props> {
    interval: any

    constructor(props: Props, context: any) {
        super(props, context)

        this.interval = null
    }

    componentDidMount() {
        this.fetchAccounts(true)
        this.initAccountPoll()
    }

    initAccountPoll() {
        if (!this.interval) {
            this.interval = setInterval(this.fetchAccounts.bind(this), 1000)
        }
    }

    fetchAccounts(initial: boolean = false) {
        const web3 = getWeb3()

        web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account, initial)
            })
            .catch((err) => {
                //
            })
    }

    handleAccount(account: string, initial: boolean = false) {
        const { account: currentAccount, receiveAccount, changeAccount } = this.props
        let next = account
        let curr = currentAccount
        next = next && next.toLowerCase()
        curr = curr && curr.toLowerCase()

        const didChange = curr && next && (curr !== next)
        const didDefine = !curr && next

        if (didDefine || (initial && next)) {
            receiveAccount(next)
        } else if (didChange) {
            changeAccount(next)
        }
    }

    render() {
        return this.props.children
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    account: selectAccount(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    receiveAccount: (account: Address) => dispatch(receiveAccount(account)),
    changeAccount: (account: Address) => dispatch(changeAccount(account)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Web3Watcher)
