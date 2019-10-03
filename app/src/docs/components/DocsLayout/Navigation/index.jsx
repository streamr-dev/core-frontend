// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import cx from 'classnames'
import SvgIcon from '$shared/components/SvgIcon'
import { docsNav } from '$docs/components/DocsLayout/Navigation/navLinks'
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

    toggleExpand = () => {
        this.setState({
            compressed: !this.state.compressed,
        })
    }

    generateNavigation(topLevelNav, index) {
        const navItem = docsNav[topLevelNav]
        const isActiveSection = this.isActiveSection(navItem)
        const { pathname } = this.props.location

        return (
            <React.Fragment key={index}>
                <li className={styles.navListItem}>
                    <Link className={isActiveSection ? styles.active : ''} to={navItem.root}>{topLevelNav}</Link>
                </li>
                <ul
                    className={cx(styles.subNavList, {
                        [styles.show]: isActiveSection,
                        [styles.hide]: !isActiveSection,
                    })}
                >
                    {/* Render subNav contents */}
                    {Object.keys(navItem).map((subKey) => {
                        if (subKey !== 'root') {
                            return (
                                <li key={subKey} className={styles.navListItem}>
                                    {/* $FlowFixMe */}
                                    <Link className={pathname.includes(navItem[subKey]) ? styles.active : ''} to={navItem[subKey]}>{subKey}</Link>
                                </li>)
                        }
                        return null
                    })
                    }
                </ul>
            </React.Fragment>
        )
    }

    isActiveSection(subNavList) {
        let match = false

        Object.keys(subNavList).forEach((subKey) => {
            // $FlowFixMe
            if (this.props.location.pathname.includes(subNavList[subKey])) {
                match = true
            }
        })

        return match
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
                    {/* {!!responsive && this.parseCurrentPage()} */}
                    {Object.keys(docsNav).map((topLevelNav, index) => this.generateNavigation(topLevelNav, index))}
                </ul>
                <SvgIcon name="back" className={styles.arrowExtender} />
            </div>
        )
    }
}

export default withRouter(Navigation)
