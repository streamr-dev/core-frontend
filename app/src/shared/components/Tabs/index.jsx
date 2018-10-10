// @flow

import React, { Component, type Element } from 'react'

import Tab from './Tab'
import TabBarTab from './TabBarTab'
import styles from './tabs.pcss'

type Props = {
    children: Array<Element<typeof Tab>>,
    defaultActiveIndex?: number,
}

type State = {
    currentIndex: number,
}

class Tabs extends Component<Props, State> {
    static Tab = Tab

    constructor(props: Props) {
        super()
        this.state = {
            currentIndex: props.defaultActiveIndex || 0,
        }
    }

    onTabClick = (currentIndex: number) => {
        this.setState({
            currentIndex,
        })
    }

    renderTabBar = () => React.Children.map(this.props.children, (child: Element<typeof Tab>, index) => {
        if (child.props.isExtra) {
            return child.props.children
        }

        return (
            <TabBarTab
                index={index}
                active={this.state.currentIndex === index}
                onClick={this.onTabClick}
            >
                {child.props.title}
            </TabBarTab>
        )
    })

    renderContent = () => React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
        active: this.state.currentIndex === index,
    }))

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.tabBar}>
                    {this.renderTabBar()}
                </div>
                <div className={styles.content}>
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}

export default Tabs
