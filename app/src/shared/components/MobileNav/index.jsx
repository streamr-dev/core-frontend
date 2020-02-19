// @flow

import React, { Fragment, useCallback, useState, useMemo } from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import Link from '$shared/components/Link'
import LogoItem from '../Nav/LogoItem'
import Bar from './Bar'
import Hamburger from './Hamburger'
import routes from '$routes'
import styles from './mobileNav.pcss'

type StateProps = {
    currentUser: ?User,
}

type Props = StateProps & {
    className?: ?string,
    location: Location,
}

const mapStateToProps = (state): StateProps => ({
    currentUser: selectUserData(state),
})

const MobileNav = compose(
    connect(mapStateToProps),
    withRouter,
)(({ currentUser, location: { pathname: redirect }, className }: Props) => {
    const [open, setOpen] = useState(false)

    const toggle = useCallback(() => {
        setOpen((current) => !current)
    }, [])

    const siteSection = useMemo(() => {
        if (redirect) {
            if (redirect === '/' || redirect.startsWith('/marketplace')) {
                return 'marketplace'
            }

            if (redirect.startsWith('/canvas')) {
                return 'editor'
            }

            if (redirect.startsWith('/core') || redirect.startsWith('/dashboard')) {
                return 'core'
            }

            if (redirect.startsWith('/docs')) {
                return 'docs'
            }
        }

        return undefined
    }, [redirect])

    return (
        <nav
            className={cx(styles.root, className, {
                [styles.open]: open,
            })}
        >
            {!!open && <BodyClass className={NO_SCROLL} />}
            <Bar
                left={(
                    <Fragment>
                        <LogoItem />
                        {siteSection && (
                            <Translate
                                value={`general.nav.${siteSection}`}
                                className={styles.siteSection}
                            />
                        )}
                    </Fragment>
                )}
                right={(
                    <Hamburger onClick={toggle} />
                )}
            />
            <div className={styles.menu}>
                <Bar
                    right={(
                        <Hamburger onClick={toggle} open />
                    )}
                />
                <div className={styles.items}>
                    <ul>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.marketplace()}
                            >
                                <Translate value="general.marketplace" />
                            </Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.streams()}
                            >
                                <Translate value="general.streams" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.canvases()}
                            >
                                <Translate value="general.canvases" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.dashboards()}
                            >
                                <Translate value="general.dashboards" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.products()}
                            >
                                <Translate value="general.products" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.purchases()}
                            >
                                <Translate value="general.purchases" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.transactions()}
                            >
                                <Translate value="general.transactions" />
                            </Link>
                        </li>
                    </ul>
                    {!currentUser && (
                        <ul>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.login(redirect !== '/' ? {
                                        redirect,
                                    } : {})}
                                >
                                    <Translate value="general.signIn" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={cx(styles.link, styles.outlined)}
                                    to={routes.signUp()}
                                >
                                    <Translate value="general.signUp" />
                                </Link>
                            </li>
                        </ul>
                    )}
                    {!!currentUser && (
                        <ul>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.editProfile()}
                                >
                                    <Translate value="general.profile" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.editProfile({}, 'api-keys')}
                                >
                                    <Translate value="userpages.profilePage.apiCredentials.linkTitle" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.editProfile({}, 'ethereum-accounts')}
                                >
                                    <Translate value="userpages.profilePage.ethereumAddress.linkTitle" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.editProfile({}, 'private-keys')}
                                >
                                    <Translate value="userpages.profilePage.ethereumPrivateKeys.linkTitle" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.logout()}
                                >
                                    <Translate value="general.logout" />
                                </Link>
                            </li>
                        </ul>
                    )}
                    <ul>
                        <li className={styles.label}>Contact Us</li>
                        <li />
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.contactGeneral()}
                            >
                                <Translate value="general.general" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.contactMedia()}
                            >
                                <Translate value="general.media" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.contactJobs()}
                            >
                                <Translate value="general.jobs" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.contactLabs()}
                            >
                                <Translate value="general.labs" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
})

export default MobileNav
