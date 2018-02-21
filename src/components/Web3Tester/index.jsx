// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {testWeb3Browser, testNetwork, getClickCount, click, resetClicks} from '../../actions/Web3TesterActions'

import type {Web3State} from '../../flowtype/states/web3-state'
import type {EthereumNetwork} from '../../flowtype/web3-types'

type StateProps = {
    currentAddress: ?string,
    network: ?EthereumNetwork,
    clickCount: ?number,
    executingTransaction: boolean
}

type DispatchProps = {
    testWeb3: () => void,
    testNetwork: () => void,
    getClickCount: () => void,
    click: () => void,
    resetClicks: () => void
}

type GivenProps = {}

type Props = StateProps & DispatchProps & GivenProps

type State = {}

export class Web3Tester extends Component<Props, State> {
    componentWillMount() {
        this.props.testWeb3()
        this.props.testNetwork()
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.currentAddress && this.props.currentAddress !== newProps.currentAddress) {
            this.props.getClickCount()
        }
    }

    click = () => {
        this.props.click()
    }

    resetClicks = () => (
        this.props.resetClicks()
    )

    render() {
        return (
            <div>
                {this.props.executingTransaction && (
                    <div>
                        Executing...
                    </div>
                )}
                Current address : {JSON.stringify(this.props.currentAddress)}<br/>
                Ethereum network name : {this.props.network && this.props.network.name}<br/>
                Click count: {this.props.clickCount}

                <div>
                    <button onClick={this.click}>Click</button>
                </div>

                <div>
                    <button onClick={this.resetClicks}>Reset</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({web3}: {web3: Web3State}): StateProps => ({
    currentAddress: web3.currentAddress,
    network: web3.network,
    clickCount: web3.clickCount,
    executingTransaction: web3.executingTransactions.length > 0
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    testWeb3() {
        dispatch(testWeb3Browser())
    },
    testNetwork() {
        dispatch(testNetwork())
    },
    getClickCount() {
        dispatch(getClickCount())
    },
    click() {
        dispatch(click())
    },
    resetClicks() {
        dispatch(resetClicks())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Web3Tester)
