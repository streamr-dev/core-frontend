// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'

import cx from 'classnames'
import { docsNav } from '$docs/components/DocsLayout/Navigation/navLinks'

import styles from '../navigation.pcss'

type Props = {
    location: Location,
}

const TableOfContents = ({ location }: Props) => {
    const isActiveSection = (subNavList) => Object.keys(subNavList).some((subKey) => (
        location.pathname.includes(subNavList[subKey])
    ))

    return (
        Object.keys(docsNav).map((topLevelNav, index) => {
            const navItem = docsNav[topLevelNav]
            const { pathname } = location
            return ( // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                    <li className={styles.navListItem}>
                        <Link className={isActiveSection(navItem) ? styles.active : ''} to={navItem.root}>{topLevelNav}</Link>
                    </li>
                    <ul
                        className={cx(styles.subNavList, {
                            [styles.show]: isActiveSection(navItem),
                            [styles.hide]: !isActiveSection(navItem),
                        })}
                    >
                        {/* Render subNav contents */}
                        {Object.keys(navItem).filter((subKey) => subKey !== 'root').map((subKey) => (
                            <li key={subKey} className={styles.navListItem}>
                                <Link
                                    className={pathname.includes(navItem[subKey]) ? styles.active : ''}
                                    to={navItem[subKey]}
                                >
                                    {subKey}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </React.Fragment>
            )
        })
    )
}

export default withRouter(TableOfContents)
