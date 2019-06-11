// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import { formatPath } from '$shared/utils/url'
import SvgIcon from '$shared/components/SvgIcon'

import type { NavigationLink } from '$newdocs/flowtype/navigation-types'

import styles from './pageTurner.pcss'

type Props = {
    navigationItems: NavigationLink,
    location: Location,
}

class PageTurner extends React.Component<Props> {
    // pathMatch: True when the current URL pathname is a match to the current navigationItems item.
    // firstPathMatch: True when the current URL pathname is a match to the first navigationItems item.
    // navDirections: An object containing the previous and next pages when the direction is valid.
    pathMatch: boolean = false
    firstPathMatch: boolean = false
    navDirections: NavigationLink = this.calcNavDirections()

    calcNavDirections() {
        // calcNavDirections: Calculates the previous and next pages based on the current URL pathname.
        // It does this by cycling through navigationItems to get the surrounding items (navDirections) of the matched navigation path.
        // It pushes and replaces navDirections object items when the pathMatch has not been discovered yet,
        // When the pathMatch is discovered the navDirections will accept at most one more item.
        // Edge case for firstPathMatch (navDirections length == 1).
        const { navigationItems } = this.props
        const { pathname } = this.props.location

        return Object.entries(navigationItems).reduce((acc, [navigationTitle, navigationPath], index) => {
            let navDirections = {
                ...acc,
            }

            if (navigationPath === pathname) {
                this.pathMatch = true
            }

            if (this.pathMatch && index === 0) {
                this.firstPathMatch = true
                return navDirections
            }

            switch (Object.keys(navDirections).length) {
                case 0:
                    if (navigationPath !== pathname) {
                        navDirections[navigationTitle] = navigationPath
                    }
                    return navDirections
                case 1:
                    if (!this.firstPathMatch) {
                        if (navigationPath !== pathname && !this.pathMatch) {
                            navDirections = {}
                            navDirections[navigationTitle] = navigationPath
                        } else if (navigationPath !== pathname && this.pathMatch) {
                            navDirections[navigationTitle] = navigationPath
                        }
                    }
                    return navDirections
                default:
                    return navDirections
            }
        }, {})
    }

    renderNavButtons() {
        return (
            Object.entries(this.navDirections).map(([linkTitle, linkPath], index) => (
                <li
                    key={`item-${String(linkTitle)}`}
                    className={cx(styles.navButton, {
                        [styles.backward]: index === 0 && !this.firstPathMatch,
                        [styles.forward]: index === 1 || this.firstPathMatch,
                    })}
                >
                    <Link to={formatPath(String(linkPath))}>
                        {(index === 0 && !this.firstPathMatch) ? 'Back to ' : ''}{linkTitle}
                        <SvgIcon
                            name="back"
                            className={styles.arrow}
                        />
                    </Link>
                </li>
            ))
        )
    }

    render() {
        return (
            <ul className={styles.pageTurnerContainer}>
                {this.renderNavButtons()}
            </ul>
        )
    }
}

export default withRouter(PageTurner)
