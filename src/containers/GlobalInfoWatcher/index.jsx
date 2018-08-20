// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'

import { getWeb3 } from '../../web3/web3Provider'
import { selectAccountId, selectNetworkId } from '../../modules/web3/selectors'
import { selectDataPerUsd } from '../../modules/global/selectors'

import { receiveAccount, changeAccount, accountError, updateEthereumNetworkId } from '../../modules/web3/actions'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'
import type { ErrorInUi, NumberString } from '../../flowtype/common-types'
import type { StreamrWeb3 as StreamrWeb3Type } from '../../web3/web3Provider'
import { getUserData } from '../../modules/user/actions'
import {
    getDataPerUsd as getDataPerUsdAction,
    checkEthereumNetwork as checkEthereumNetworkAction,
    updateMetamaskPermission,
} from '../../modules/global/actions'
import { areAddressesEqual } from '../../utils/smartContract'

type OwnProps = {
    children?: Node,
}

type StateProps = {
    account: any,
    networkId: any,
}

type DispatchProps = {
    receiveAccount: (Address) => void,
    changeAccount: (Address) => void,
    accountError: (error: ErrorInUi) => void,
    getUserData: () => void,
    getDataPerUsd: () => void,
    checkEthereumNetwork: () => void,
    updateMetamaskPermission: (boolean) => void,
    updateEthereumNetworkId: (id: any) => void,
}

type Props = OwnProps & StateProps & DispatchProps

const ONE_SECOND = 1000
const FIVE_MINUTES = 1000 * 60 * 5
const SIX_HOURS = 1000 * 60 * 60 * 6

export class GlobalInfoWatcher extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        // Start polling for info
        this.pollDataPerUsdRate()
        this.pollLogin()
        this.pollWeb3(true)
        this.pollEthereumNetwork(true)
    }

    componentWillMount = () => {
        if (typeof window.web3 === 'undefined') {
            // Listen for provider injection
            window.addEventListener('message', ({ data }) => {
                if (data && data.type && data.type === 'ETHEREUM_PROVIDER_SUCCESS') {
                    // Metamask account access is granted by user
                    this.props.updateMetamaskPermission(true)
                    this.web3 = getWeb3()
                }
            })
        } else {
            // Web3 is injected (legacy browsers)
            // Metamask account access is granted without permission
            this.props.updateMetamaskPermission(true)
            this.web3 = getWeb3()
        }
    }
    componentWillUnmount = () => {
        this.clearWeb3Poll()
        this.clearDataPerUsdRatePoll()
        this.clearLoginPoll()
    }

    web3PollTimeout: ?TimeoutID = null
    loginPollTimeout: ?TimeoutID = null
    dataPerUsdRatePollTimeout: ?TimeoutID = null
    ethereumNetworkPollTimeout: ?TimeoutID = null
    web3: StreamrWeb3Type = getWeb3()

    pollLogin = () => {
        this.props.getUserData()
        this.clearLoginPoll()
        this.loginPollTimeout = setTimeout(this.pollLogin, FIVE_MINUTES)
    }

    pollWeb3 = (initial: boolean = false) => {
        this.fetchWeb3Account(initial)
        this.clearWeb3Poll()
        this.web3PollTimeout = setTimeout(this.pollWeb3, ONE_SECOND)
    }

    pollEthereumNetwork = (initial: boolean = false) => {
        this.fetchChosenEthereumNetwork(initial)
        this.clearEthereumNetworkPoll()
        this.ethereumNetworkPollTimeout = setTimeout(this.pollEthereumNetwork, ONE_SECOND)
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

    clearEthereumNetworkPoll = () => {
        if (this.ethereumNetworkPollTimeout) {
            clearTimeout(this.ethereumNetworkPollTimeout)
            this.ethereumNetworkPollTimeout = undefined
        }
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
        const next = account
        const curr = this.props.account

        const didChange = curr && next && !areAddressesEqual(curr, next)
        const didDefine = !curr && next
        if (didDefine || (initial && next)) {
            this.props.receiveAccount(next)
        } else if (didChange) {
            this.props.changeAccount(next)
        }
    }

    fetchChosenEthereumNetwork = (initial: boolean = false) => {
        this.web3.getEthereumNetwork()
            .then((network) => {
                this.handleNetwork(network.toString(), initial)
                return Promise.resolve()
            }, (err) => {
                this.props.accountError(err)
            })
    }

    handleNetwork = (network: NumberString, initial: boolean = false) => {
        const next = network
        const curr = this.props.networkId
        const didChange = curr && next && curr !== next
        const didDefine = !curr && next
        if (didDefine || (initial && next) || didChange) {
            this.props.updateEthereumNetworkId(next)
            this.props.checkEthereumNetwork()
        }
    }

    render = () => this.props.children
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    account: selectAccountId(state),
    dataPerUsd: selectDataPerUsd(state),
    networkId: selectNetworkId(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    receiveAccount: (id: Address) => dispatch(receiveAccount(id)),
    changeAccount: (id: Address) => dispatch(changeAccount(id)),
    accountError: (error: ErrorInUi) => dispatch(accountError(error)),
    getUserData: () => dispatch(getUserData()),
    getDataPerUsd: () => dispatch(getDataPerUsdAction()),
    checkEthereumNetwork: () => dispatch(checkEthereumNetworkAction()),
    updateMetamaskPermission: (metamaskPermission: boolean) => dispatch(updateMetamaskPermission(metamaskPermission)),
    updateEthereumNetworkId: (id: any) => dispatch(updateEthereumNetworkId(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalInfoWatcher)
