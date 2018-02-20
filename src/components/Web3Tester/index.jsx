// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {testWeb3Browser, testNetwork, getClickCount, click} from '../../actions/Web3TesterActions'

import type {Web3State} from '../../flowtype/states/web3-state'
import type {EthereumNetwork} from '../../flowtype/web3-types'

type StateProps = {
    web3Enabled: ?boolean,
    network: ?EthereumNetwork,
    clickCount: ?number
}

type DispatchProps = {
    testWeb3: () => void,
    testNetwork: () => void,
    getClickCount: () => void,
    click: () => void
}

type GivenProps = {}

type Props = StateProps & DispatchProps & GivenProps

type State = {}

export class Web3Tester extends Component<Props, State> {
    componentWillMount() {
        this.props.testWeb3()
        this.props.testNetwork()
        this.props.getClickCount()
    }

    click = () => {
        this.props.click()
    }

    render() {
        return (
            <div>
                Web3 enabled : {JSON.stringify(this.props.web3Enabled)}<br/>
                Ethereum network name : {this.props.network && this.props.network.name}<br/>
                Click count: {this.props.clickCount}

                <div>
                    <button onClick={this.click}>Click</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({web3}: {web3: Web3State}): StateProps => ({
    web3Enabled: web3.web3Enabled,
    network: web3.network,
    clickCount: web3.clickCount
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
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Web3Tester)
