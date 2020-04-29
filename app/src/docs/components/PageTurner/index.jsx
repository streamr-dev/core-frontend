// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import SvgIcon from '$shared/components/SvgIcon'
import docsMap from '$docs/docsMap'

import styles from './pageTurner.pcss'

type Props = {
    location: Location,
}

type State = {
    documentHeight: number,
}

class PageTurner extends React.Component<Props, State> {
    // currentPathMatch: True when the current URL pathname is a match to the current docsNav item.
    // firstPathMatch: True when the current URL pathname is a match to the first docsNav item.
    // matchFound: A pathname match found which is not the first item.
    // navDirections: An object containing the previous and next pages when the direction is valid.

    state = {
        documentHeight: 0,
    }

    componentDidMount() {
        this.getScrollHeight()
        window.addEventListener('load', this.getScrollHeight)
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.getScrollHeight)
    }

    getScrollHeight = () => {
        this.setState({
            documentHeight: window.document.body.scrollHeight,
        })
    }

    currentPathMatch: boolean = false
    firstPathMatch: boolean = false
    matchFound: boolean = false
    navDirections = this.calcNavDirections()

    isExtraPaddingRequired = () => this.state.documentHeight < 2000 && this.state.documentHeight !== 0 && window.document.body.scrollWidth > 991

    isPathnameMatch(pathnames) {
        let match = false

        Object.keys(pathnames).forEach((subKey) => {
            if (this.props.location.pathname.includes(pathnames[subKey].path)) {
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

        return Object.entries(docsMap).reduce((acc, [navigationTitle, navigationPath]: any, index) => {
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
                    <Link to={linkPath.root.path}>
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
            <div className={this.isExtraPaddingRequired() ? styles.extraPadding : null}>
                <hr />
                <ul className={styles.pageTurnerContainer}>
                    {this.generateNavButtons()}
                </ul>
            </div>
        )
    }
}

export default withRouter(PageTurner)
