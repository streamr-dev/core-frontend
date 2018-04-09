// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'

import getWeb3 from '../../web3/web3Provider'
import { selectAccountId } from '../../modules/web3/selectors'
import { receiveAccount, changeAccount, accountError } from '../../modules/web3/actions'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { StreamrWeb3 } from '../../web3/web3Provider'
import { getUserDataAndKeys } from '../../modules/user/actions'

type OwnProps = {
    children?: Node,
}

type StateProps = {
    account: any,
}

type DispatchProps = {
    receiveAccount: (Address) => void,
    changeAccount: (Address) => void,
    accountError: (error: ErrorInUi) => void,
    getUserDataAndKeys: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

const ONE_SECOND = 1000
const FIVE_MINUTES = 1000 * 60 * 5

class UserInfoWatcher extends React.Component<Props> {
    componentDidMount = () => {
        // Do initial fetching of login info and Metamask account
        this.fetchWeb3Account(true)
        this.props.getUserDataAndKeys()

        // Start polling for Metamask and login session
        this.initWeb3Poll()
        this.initLoginPoll()
    }

    componentWillUnmount = () => {
        if (this.web3Poller) {
            clearInterval(this.web3Poller)
        }
        if (this.loginPoller) {
            clearInterval(this.loginPoller)
        }
    }

    web3Poller: ?IntervalID = null
    loginPoller: ?IntervalID = null
    web3: StreamrWeb3 = getWeb3()

    initLoginPoll = () => {
        if (!this.loginPoller) {
            this.loginPoller = setInterval(this.props.getUserDataAndKeys, FIVE_MINUTES)
        }
    }

    initLoginPoll = () => {
        if (!this.loginPoller) {
            this.loginPoller = setInterval(this.props.getUserDataAndKeys, FIVE_MINUTES)
        }
    }

    initWeb3Poll = () => {
        if (!this.web3Poller) {
            this.web3Poller = setInterval(this.fetchWeb3Account, ONE_SECOND)
        }
    }

    fetchWeb3Account = (initial: boolean = false) => {
        this.web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account, initial)

                // needed to avoid warnings about creating promise inside a handler
                // if any other web3 actions are dispatched.
                return Promise.resolve()
            })
            .catch((err) => {
                const { account: currentAccount } = this.props

                if (initial || currentAccount !== null) {
                    this.props.accountError(err)
                }
            })
    }

    handleAccount = (account: string, initial: boolean = false) => {
        let next = account
        let curr = this.props.account
        next = next && next.toLowerCase()
        curr = curr && curr.toLowerCase()

        const didChange = curr && next && (curr !== next)
        const didDefine = !curr && next

        if (didDefine || (initial && next)) {
            this.props.receiveAccount(next)
        } else if (didChange) {
            this.props.changeAccount(next)
        }
    }

    render = () => (
        this.props.children
    )
}

const mapStateToProps = (state: StoreState): StateProps => ({
    account: selectAccountId(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    receiveAccount: (id: Address) => dispatch(receiveAccount(id)),
    changeAccount: (id: Address) => dispatch(changeAccount(id)),
    accountError: (error: ErrorInUi) => dispatch(accountError(error)),
    getUserDataAndKeys: () => dispatch(getUserDataAndKeys()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoWatcher)
