// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import { formatPath } from '$shared/utils/url'
import SvgIcon from '$shared/components/SvgIcon'

import type { NavigationLink } from '$docs/flowtype/navigation-types'

import styles from './pageTurner.pcss'

type Props = {
    navigationItems: NavigationLink,
    location: Location,
}

class PageTurner extends React.Component<Props> {
    generateNavButtons() {
        const { navigationItems } = this.props
        const { pathname } = this.props.location

        let pathMatch = false
        let firstMatch = false

        const navigationPaths = Object.entries(navigationItems).reduce((acc, [key, val], index) => {
            let result = {
                ...acc,
            }

            if (val === pathname) {
                pathMatch = true
            }

            if (pathMatch && index === 0) {
                firstMatch = true
                return result
            }

            switch (Object.keys(result).length) {
                case 0:
                    if (val !== pathname) {
                        result[key] = val
                    }
                    return result
                case 1:
                    if (!firstMatch) {
                        if (val !== pathname && !pathMatch) {
                            result = {}
                            result[key] = val
                        } else if (val !== pathname && pathMatch) {
                            result[key] = val
                        }
                    }
                    return result
                default:
                    return result
            }
        }, {})

        return (
            Object.entries(navigationPaths).map(([linkTitle, linkPath], index) => (
                <li
                    key={`item-${String(linkTitle)}`}
                    className={cx(styles.navButton, {
                        [styles.backward]: index === 0 && !firstMatch,
                        [styles.forward]: index === 1 || firstMatch,
                    })}
                >
                    <Link to={formatPath(String(linkPath))}>
                        {(index === 0 && !firstMatch) ? 'Back to ' : ''}{linkTitle}
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
                {this.generateNavButtons()}
            </ul>
        )
    }
}

export default withRouter(PageTurner)
