// @flow

import React from 'react'
import { connect } from 'react-redux'

import getWeb3 from '../../web3/web3Provider'
import { selectAccountId } from '../../modules/web3/selectors'
import { receiveAccount, changeAccount, accountError } from '../../modules/web3/actions'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'
import type { ErrorInUi } from '../../flowtype/common-types'

type OwnProps = {
    children?: React$Node,
}

type StateProps = {
    account: any,
}

type DispatchProps = {
    receiveAccount: (Address) => void,
    changeAccount: (Address) => void,
    accountError: (error: ErrorInUi) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class Web3Watcher extends React.Component<Props> {
    interval: any = null

    componentDidMount = () => {
        this.fetchAccounts(true)
        this.initAccountPoll()
    }

    componentWillUnmount = () => {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    initAccountPoll = () => {
        if (!this.interval) {
            this.interval = setInterval(this.fetchAccounts, 1000)
        }
    }

    fetchAccounts = (initial: boolean = false) => {
        const web3 = getWeb3()

        web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account, initial)
            })
            .catch((err) => {
                const { account: currentAccount } = this.props

                if (initial || currentAccount !== null) {
                    this.props.accountError(err)
                }
            })
    }

    handleAccount = (account: string, initial: boolean = false) => {
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

    render = () => {
        return this.props.children
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    account: selectAccountId(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    receiveAccount: (id: Address) => dispatch(receiveAccount(id)),
    changeAccount: (id: Address) => dispatch(changeAccount(id)),
    accountError: (error: ErrorInUi) => dispatch(accountError(error)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Web3Watcher)
