// @flow

import React, { Component, type Element } from 'react'

import Tab from './Tab'
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

    render() {
        const { children } = this.props
        const { currentIndex } = this.state

        return (
            <div className={styles.container}>
                <div className={styles.tabBar}>
                    {React.Children.map(children, (child, index) => React.cloneElement(child, {
                        index,
                        active: index === currentIndex,
                        onClick: this.onTabClick,
                    }))}
                </div>
                <div className={styles.content}>
                    {React.Children.toArray(children)[currentIndex].props.children}
                </div>
            </div>
        )
    }
}

export default Tabs
