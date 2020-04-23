// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import scrollTo from '$shared/utils/scrollTo'
import ElevatedContainer from '$shared/components/ElevatedContainer'

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
}

class Navigation extends React.Component<Props, State> {
    state = {
        compressed: true,
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
        scrollTo(document.getElementById('root'))
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

    render() {
        const { className, responsive } = this.props

        return (
            <ElevatedContainer
                offset="64"
                className={cx(className, styles.navigationContainer, {
                    [styles.compressed]: this.state.compressed,
                    [styles.mobileNav]: responsive,
                    [styles.desktopNav]: !responsive,
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
            </ElevatedContainer>
        )
    }
}

export default withRouter(Navigation)
