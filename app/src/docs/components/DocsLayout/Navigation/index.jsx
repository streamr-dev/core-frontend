// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import ElevatedContainer from '$shared/components/ElevatedContainer'

import SvgIcon from '$shared/components/SvgIcon'
import docsMap from '$docs/docsMap'
import Search from '../../Search'
import TableOfContents from './TableOfContents'

import styles from './navigation.pcss'

type Props = {
    className: String,
    responsive?: boolean,
    location: Location,
}

type State = {
    compressed: boolean,
    isSearching: boolean,
}

class Navigation extends React.Component<Props, State> {
    state = {
        compressed: true,
        isSearching: false,
    }

    getTopLevelTitle() {
        let title = ''

        Object.keys(docsMap).forEach((topLevelNavItem) => {
            if (this.props.location.pathname.includes(docsMap[topLevelNavItem].root.path)) {
                title = topLevelNavItem
            }
        })

        return title
    }

    getSecondLevelTitle() {
        let title = ''
        Object.keys(docsMap).forEach((topLevelNavItem) => {
            if (this.props.location.pathname.includes(docsMap[topLevelNavItem].root.path)) {
                Object.keys(docsMap[topLevelNavItem]).forEach((secondLevelNavItem) => {
                    if (this.props.location.pathname.includes(docsMap[topLevelNavItem][secondLevelNavItem].path)) {
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

        this.setState(({ compressed }) => ({
            compressed: !compressed,
        }))
    }

    toggleOverlay = () => {
        this.setState(({ isSearching }) => ({
            isSearching: !isSearching,
        }))
    }

    render() {
        const { className, responsive } = this.props
        const { isSearching } = this.state

        return (
            <React.Fragment>
                {isSearching && <Search visible toggleOverlay={this.toggleOverlay} />}
                <SvgIcon
                    name="search"
                    className={cx(styles.searchNavIcon, styles.mobileSearchNavIcon)}
                    onClick={() => { this.toggleOverlay() }}
                />
                <ElevatedContainer
                    offset="64"
                    className={cx(className, styles.navigationContainer, {
                        [styles.compressed]: this.state.compressed,
                        [styles.mobileNav]: responsive,
                        [styles.desktopNav]: !responsive,
                    })}
                    onClick={() => this.toggleExpand()}
                >
                    {!isSearching && <SvgIcon
                        name="search"
                        className={styles.searchNavIcon}
                        onClick={() => { this.toggleOverlay() }}
                    />}
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
                </ElevatedContainer>
            </React.Fragment>
        )
    }
}

export default withRouter(Navigation)
