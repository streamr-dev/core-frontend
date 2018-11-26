// @flow

import React, { Component, type Element } from 'react'
import type { Location } from 'react-router-dom'

import Tab from './Tab'
import styles from './tabs.pcss'

type Props = {
    children: Array<Element<typeof Tab>>,
    defaultActiveIndex?: number,
    navigate?: (string) => void,
    location?: Location,
}

type State = {
    currentIndex: number,
}

class Tabs extends Component<Props, State> {
    static Tab = Tab

    constructor(props: Props) {
        super()
        this.state = {
            currentIndex: this.getIndex(props.location, props.defaultActiveIndex, props.children),
        }
    }

    onTabClick = (currentIndex: number) => {
        const { navigate, children } = this.props

        this.setState({
            currentIndex,
        })

        if (navigate) {
            const { link } = React.Children.toArray(children)[currentIndex].props
            if (link) {
                navigate(link)
            }
        }
    }

    getIndex = (location?: Location, defaultActiveIndex?: number, children: Array<Element<typeof Tab>>): number => {
        const newIndex = React.Children.toArray(children).findIndex(({ props: { link } }) => (
            link && location && location.pathname.includes(link)
        ))

        if (newIndex >= 0) {
            return newIndex
        }

        return defaultActiveIndex || 0
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
