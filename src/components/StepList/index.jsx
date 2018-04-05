// @flow

import React, { Component, type Node } from 'react'
import Tab from './Tab'

type Props = {
    children: Array<Node>,
}

type State = {
    currentIndex: number,
}

class StepList extends Component<Props, State> {
    state = {
        currentIndex: 0,
    }

    onTabClick = (currentIndex: number) => {
        this.setState({
            currentIndex,
        })
    }

    tabs = () => React.Children.map(this.props.children, (child, index) => (
        <Tab
            index={index}
            active={this.state.currentIndex === index}
            onClick={this.onTabClick}
        >
            {child.props.title}
        </Tab>
    ))

    contents = () => React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
        active: this.state.currentIndex === index,
    }))

    render = () => (
        <div>
            {this.tabs()}
            {this.contents()}
        </div>
    )
}

export default StepList
