// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import throttle from 'lodash/throttle'

import SvgIcon from '$shared/components/SvgIcon'
import { docsNav } from '$docs/components/DocsLayout/Navigation/navLinks'
import TableOfContents from './TableOfContents'

import styles from './navigation.pcss'

type Props = {
    className: String,
    responsive?: boolean,
    location: Location,
}

type State = {
    compressed: boolean,
    topOfPage: boolean,
}

class Navigation extends React.Component<Props, State> {
    state = {
        compressed: true,
        topOfPage: true,
    }

    componentDidMount() {
        this.isTopOfPage()
        window.addEventListener('scroll', this.isTopOfPage)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.isTopOfPage)
    }

    getTopLevelTitle() {
        let title = ''

        Object.keys(docsNav).forEach((topLevelNavItem) => {
            if (this.props.location.pathname.includes(docsNav[topLevelNavItem].root)) {
                title = topLevelNavItem
            }
        })

        return title
    }

    getSecondLevelTitle() {
        let title = ''

        Object.keys(docsNav).forEach((topLevelNavItem) => {
            if (this.props.location.pathname.includes(docsNav[topLevelNavItem].root)) {
                Object.keys(docsNav[topLevelNavItem]).forEach((secondLevelNavItem) => {
                    if (this.props.location.pathname.includes(docsNav[topLevelNavItem][secondLevelNavItem])) {
                        title = secondLevelNavItem
                    }
                })
            }
        })

        return title
    }

    scrollTop = () => {
        const root = document.getElementById('root')

        if (root) {
            scrollIntoView(root, {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }

    generateMobileHeader() {
        if (this.getSecondLevelTitle() !== 'root') {
            return `${this.getTopLevelTitle()} > ${this.getSecondLevelTitle()}`
        }

        return this.getTopLevelTitle()
    }

    toggleExpand = () => {
        this.scrollTop()

        this.setState({
            compressed: !this.state.compressed,
        })
    }

    isTopOfPage = throttle(() => {
        if (window.pageYOffset === 0) {
            this.setState({
                topOfPage: true,
            })
        } else {
            this.setState({
                topOfPage: false,
            })
        }
    }, 250)

    render() {
        const { className, responsive } = this.props

        return (
            <div // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                className={cx(className, styles.navigationContainer, {
                    [styles.compressed]: this.state.compressed,
                    [styles.mobileNav]: responsive,
                    [styles.desktopNav]: !responsive,
                    [styles.bottomShadow]: responsive && !this.state.topOfPage,
                })}

                onClick={() => this.toggleExpand()}
            >
                <ul className={cx(styles.navList, {
                    container: responsive,
                })}
                >
                    {!!responsive && (
                        <li className={cx(styles.navListItem, styles.mobileHeader)}>
                            <Link to="#">
                                {this.generateMobileHeader()}
                            </Link>
                        </li>
                    )}
                    <TableOfContents />
                </ul>
                <SvgIcon name="back" className={styles.arrowExtender} />
            </div>
        )
    }
}

export default withRouter(Navigation)
