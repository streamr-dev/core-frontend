// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import { formatPath } from '$shared/utils/url'
import cx from 'classnames'
import Scrollspy from 'react-scrollspy'

import SvgIcon from '$shared/components/SvgIcon'

import type { NavigationLink } from '../../../flowtype/navigation-types'

import styles from './navigation.pcss'

type Props = {
    navigationItems: NavigationLink,
    subNavigationItems?: NavigationLink,
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

    toggleExpand = () => {
        this.scrollTop()

        this.setState({
            compressed: !this.state.compressed,
        })
    }

    scrollTop = () => {
        const root = document.getElementById('root')

        // Edge case for really long pages
        // Snap straight to top
        if (root && window.pageYOffset > 2000) {
            window.scrollTo(0, 0)
        } else if (root) {
            root.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }

    parseNavigation() {
        const { navigationItems, subNavigationItems } = this.props

        return Object.entries(navigationItems).map((navListItem) => (
            <li key={`item-${navListItem[0]}`} className={styles.navListItem}>
                <Link
                    to={formatPath(String(navListItem[1]))}
                    onClick={() => this.scrollTop()}
                    className={this.props.location.pathname === navListItem[1] ? styles.active : ''}
                >
                    {navListItem[0]}
                </Link>
                {this.props.location.pathname === navListItem[1] ?
                    (!!subNavigationItems && (<ul className={styles.subNavList}> {this.parseSubNavigation()} </ul>)) : ''}
            </li>
        ))
    }

    parseSubNavigation() {
        const { subNavigationItems } = this.props

        return (
            <Scrollspy items={subNavigationItems && Object.keys(subNavigationItems)} currentClassName={styles.active}>
                {Object.entries(subNavigationItems).map((subNavigationItem) => (
                    <li key={`item-${subNavigationItem[0]}`} className={styles.navListItem}>
                        <a
                            href={`#${subNavigationItem[0]}`}
                        >
                            {String(subNavigationItem[1])}
                        </a>
                    </li>
                ))}
            </Scrollspy>
        )
    }

    parseCurrentPage() {
        const { navigationItems } = this.props

        return Object.entries(navigationItems).map((navListItem) => (
            this.props.location.pathname === navListItem[1] ?
                (
                    <li key={`item-${String(navListItem[1])}`} className={styles.navListItem}>
                        <Link to={formatPath(String(navListItem[1]))}>
                            {navListItem[0]}
                        </Link>
                    </li>
                ) : null
        ))
    }

    render() {
        const { className, responsive } = this.props

        return (
            <div // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
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
                    {!!responsive && this.parseCurrentPage()}
                    {this.parseNavigation()}
                </ul>
                <SvgIcon name="back" className={styles.arrowExtender} />
            </div>
        )
    }
}

export default withRouter(Navigation)
