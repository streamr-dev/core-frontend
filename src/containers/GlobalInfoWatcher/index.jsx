// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'

import getWeb3 from '../../web3/web3Provider'
import { selectAccountId } from '../../modules/web3/selectors'
import { selectDataPerUsd } from '../../modules/global/selectors'
import { receiveAccount, changeAccount, accountError } from '../../modules/web3/actions'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { StreamrWeb3 } from '../../web3/web3Provider'
import { getUserDataAndKeys } from '../../modules/user/actions'
import { getDataPerUsd as getDataPerUsdAction, checkEthereumNetwork as checkEthereumNetworkAction } from '../../modules/global/actions'

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
    getDataPerUsd: () => void,
    checkEthereumNetwork: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

const ONE_SECOND = 1000
const FIVE_MINUTES = 1000 * 60 * 5
const SIX_HOURS = 1000 * 60 * 60 * 6

class GlobalInfoWatcher extends React.Component<Props> {
    componentDidMount = () => {
        // Start polling for info
        this.pollDataPerUsdRate()
        this.pollLogin()
        this.pollWeb3()
        this.checkEthereumNetwork()
    }

    componentWillUnmount = () => {
        this.clearWeb3Poll()
        this.clearDataPerUsdRatePoll()
        this.clearLoginPoll()
    }

    web3PollTimeout: ?TimeoutID = null
    loginPollTimeout: ?TimeoutID = null
    dataPerUsdRatePollTimeout: ?TimeoutID = null
    web3: StreamrWeb3 = getWeb3()

    pollLogin = () => {
        this.props.getUserDataAndKeys()
        this.clearLoginPoll()
        this.loginPollTimeout = setTimeout(this.pollLogin, FIVE_MINUTES)
    }

    pollWeb3 = () => {
        this.fetchWeb3Account()
        this.clearWeb3Poll()
        this.web3PollTimeout = setTimeout(this.pollWeb3, ONE_SECOND)
    }

    pollDataPerUsdRate = () => {
        this.props.getDataPerUsd()
        this.clearDataPerUsdRatePoll()
        this.dataPerUsdRatePollTimeout = setTimeout(this.pollDataPerUsdRate, SIX_HOURS)
    }

    clearLoginPoll = () => {
        if (this.loginPollTimeout) {
            clearTimeout(this.loginPollTimeout)
            this.loginPollTimeout = undefined
        }
    }

    clearWeb3Poll = () => {
        if (this.web3PollTimeout) {
            clearTimeout(this.web3PollTimeout)
            this.web3PollTimeout = undefined
        }
    }

    clearDataPerUsdRatePoll = () => {
        if (this.dataPerUsdRatePollTimeout) {
            clearTimeout(this.dataPerUsdRatePollTimeout)
            this.dataPerUsdRatePollTimeout = undefined
        }
    }

    //  MetaMask refreshes the browser when changing the network.
    //  Otherwise this should also be a poller.
    checkEthereumNetwork = () => {
        this.props.checkEthereumNetwork()
    }

    fetchWeb3Account = (initial: boolean = false) => {
        this.web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account, initial)

                // needed to avoid warnings about creating promise inside a handler
                // if any other web3 actions are dispatched.
                return Promise.resolve()
            }, (err) => {
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

    render = () => this.props.children
}

const mapStateToProps = (state: StoreState): StateProps => ({
    account: selectAccountId(state),
    dataPerUsd: selectDataPerUsd(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    receiveAccount: (id: Address) => dispatch(receiveAccount(id)),
    changeAccount: (id: Address) => dispatch(changeAccount(id)),
    accountError: (error: ErrorInUi) => dispatch(accountError(error)),
    getUserDataAndKeys: () => dispatch(getUserDataAndKeys()),
    getDataPerUsd: () => dispatch(getDataPerUsdAction()),
    checkEthereumNetwork: () => dispatch(checkEthereumNetworkAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalInfoWatcher)
