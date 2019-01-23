// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import { formatPath } from '$shared/utils/url'

import type { NavigationLink } from '../../../flowtype/navigation-types'

import styles from './navigation.pcss'

type Props = {
    navigationItems: NavigationLink,
    subNavigationItems?: NavigationLink,
    location: Location,
}

class Navigation extends React.Component<Props> {
    parseNavigation() {
        const { navigationItems, subNavigationItems } = this.props

        return Object.entries(navigationItems).map((navListItem) => (
            <li key={`item-${navListItem[0]}`} className={styles.navListItem}>
                <Link
                    to={formatPath(String(navListItem[1]))}
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

        return Object.entries(subNavigationItems).map((subNavigationItem) => (
            <li key={`item-${subNavigationItem[0]}`} className={styles.navListItem}>
                <a
                    href={`#${subNavigationItem[0]}`}
                    className={this.props.location.hash.substr(1) === subNavigationItem[0] ? styles.active : ''}
                >
                    {String(subNavigationItem[1])}
                </a>
            </li>
        ))
    }

    render() {
        return (
            <ul className={styles.navList}>
                {this.parseNavigation()}
            </ul>
        )
    }
}

export default withRouter(Navigation)
