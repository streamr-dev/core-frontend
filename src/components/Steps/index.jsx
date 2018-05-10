// @flow

import React, { Component, type Node } from 'react'
import Buttons from '../Buttons'
import Tab from './Tab'

type Props = {
    children: Array<Node>,
    onCancel: () => void,
    onComplete: () => void,
    tabClassName?: string,
}

type State = {
    currentIndex: number,
}

class Steps extends Component<Props, State> {
    state = {
        currentIndex: 0,
    }

    onTabClick = (currentIndex: number) => {
        this.setState({
            currentIndex,
        })
    }

    onNext = () => {
        const { children, onComplete } = this.props
        const count = React.Children.count(children)
        const { currentIndex } = this.state

        const disabledSteps = this.disabledSteps()
        if (disabledSteps[currentIndex + 1] || currentIndex === count - 1) {
            onComplete()
            return
        }

        this.setState({
            currentIndex: Math.min(currentIndex + 1, count - 1),
        })
    }

    nextButtonLabel = () => {
        const { children } = this.props
        const { currentIndex } = this.state
        const buttonLabels = this.nextButtonLabels()
        return buttonLabels[currentIndex] || (currentIndex === React.Children.count(children) - 1 ? 'Set' : 'Next')
    }

    nextButtonOutline = () => {
        const { children } = this.props
        const { currentIndex } = this.state
        return currentIndex !== React.Children.count(children) - 1
    }

    tabs = () => React.Children.map(this.props.children, (child, index) => (
        <Tab
            index={index}
            active={this.state.currentIndex === index}
            onClick={this.onTabClick}
            disabled={this.state.currentIndex < index}
            className={this.props.tabClassName}
        >
            {child.props.title}
        </Tab>
    ))

    disabledSteps = () => React.Children.map(this.props.children, (child) => child.props.disabled || false)
    nextButtonLabels = () => React.Children.map(this.props.children, (child) => child.props.nextButtonLabel || '')

    contents = () => React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
        active: this.state.currentIndex === index,
    }))

    render = () => (
        <div>
            {this.tabs()}
            {this.contents()}
            <Buttons
                actions={{
                    cancel: {
                        title: 'Cancel',
                        outline: true,
                        onClick: this.props.onCancel,
                    },
                    next: {
                        title: this.nextButtonLabel(),
                        outline: this.nextButtonOutline(),
                        color: 'primary',
                        onClick: this.onNext,
                    },
                }}
            />
        </div>
    )
}

export default Steps
