// @flow

import React, { Component, type Node, Fragment } from 'react'
import classNames from 'classnames'

import Buttons from '../Buttons'
import withI18n from '../../containers/WithI18n'

import Tab from './Tab'
import styles from './steps.pcss'

type Props = {
    children: Array<Node>,
    onCancel: () => void,
    onComplete: () => void,
    tabClassName?: string,
    isDisabled: boolean,
    errors?: Array<string>,
    translate: (key: string, options: any) => string,
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
        const { children, translate } = this.props
        const { currentIndex } = this.state
        const buttonLabels = this.nextButtonLabels()
        return buttonLabels[currentIndex] || (currentIndex === React.Children.count(children) - 1 ?
            translate('steps.set') :
            translate('modal.common.next')
        )
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
                className={classNames({
                    [styles.withErrors]: !!this.props.errors,
                })}
                actions={{
                    cancel: {
                        title: this.props.translate('modal.common.cancel'),
                        outline: true,
                        onClick: this.props.onCancel,
                    },
                    next: {
                        title: this.nextButtonLabel(),
                        outline: this.nextButtonOutline(),
                        color: 'primary',
                        onClick: this.onNext,
                        disabled: this.props.isDisabled,
                    },
                }}
            />
            <div className={styles.errors}>
                {this.props.errors && this.props.errors.map((error) => (
                    <Fragment key={error}>
                        <span className={classNames('icon-warning-triangle', styles.errorIcon)} />
                        <span>{error}</span>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default withI18n(Steps)
