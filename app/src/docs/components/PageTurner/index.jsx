// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import SvgIcon from '$shared/components/SvgIcon'
import { docsNav } from '$docs/components/DocsLayout/Navigation/navLinks'

import type { DocsNav } from '$docs/flowtype/navigation-types'

import styles from './pageTurner.pcss'

type Props = {
    location: Location,
}

class PageTurner extends React.Component<Props> {
    // currentPathMatch: True when the current URL pathname is a match to the current docsNav item.
    // firstPathMatch: True when the current URL pathname is a match to the first docsNav item.
    // matchFound: A pathname match found which is not the first item.
    // navDirections: An object containing the previous and next pages when the direction is valid.

    currentPathMatch: boolean = false
    firstPathMatch: boolean = false
    matchFound: boolean = false
    navDirections: DocsNav = this.calcNavDirections()

    isPathnameMatch(pathnames) {
        let match = false

        Object.keys(pathnames).forEach((subKey) => {
            if (this.props.location.pathname.includes(pathnames[subKey])) {
                match = true
            }
        })

        return match
    }

    calcNavDirections() {
        // calcNavDirections: Calculates the previous and next top-level pages based on the current URL pathname.
        // It does this by cycling through docsNav to get the surrounding items (navDirections) of the matched navigation path.
        // It pushes and replaces navDirections object items when the currentPathMatch has not been discovered yet,
        // When currentPathMatch is true, the navDirections will accept at most, the next item.
        // Edge case for firstPathMatch (navDirections: length == 1 & index == 0).

        return Object.entries(docsNav).reduce((acc, [navigationTitle, navigationPath]: any, index) => {
            let navDirections = {
                ...acc,
            }
            // e.g. {
            //          'Getting Started': ..,
            //           Streams: ...,
            //      }

            this.currentPathMatch = this.isPathnameMatch(navigationPath)
            // Is the user inside this particular top-level path?

            if (this.currentPathMatch && index === 0) {
                this.firstPathMatch = true
                return navDirections
            }

            // Update the function accumulator with a new nav button if needs be.
            switch (Object.keys(navDirections).length) {
                case 0: // always inject the current nav item, as a match can be found on the next attempt.
                    navDirections[navigationTitle] = navigationPath

                    return navDirections

                case 1:
                    if (this.firstPathMatch) { // We only need 1 chapter! Done.
                        return navDirections
                    }

                    if (this.currentPathMatch) { // We've found a match. Flag for next round.
                        this.matchFound = true
                        return navDirections
                    }

                    if (this.matchFound) { // Previous run found the match, insert this chapter for injection. Done.
                        navDirections[navigationTitle] = navigationPath
                    } else { // Keep going!
                        navDirections = {}
                        navDirections[navigationTitle] = navigationPath
                    }

                    return navDirections

                default:
                    // Don't update - we have our two chapters!
                    return navDirections
            }
        }, {})
    }

    generateNavButtons() {
        return (
            Object.entries(this.navDirections).map(([linkTitle, linkPath]: any, index) => (
                <li
                    key={`item-${String(linkTitle)}`}
                    className={cx(styles.navButton, {
                        [styles.backward]: index === 0 && !this.firstPathMatch,
                        [styles.forward]: index === 1 || this.firstPathMatch,
                    })}
                >
                    <Link to={linkPath.root}>
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
                {this.generateNavButtons()}
            </ul>
        )
    }
}

export default withRouter(PageTurner)
