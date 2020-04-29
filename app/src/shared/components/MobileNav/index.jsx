// @flow

import React, { Fragment, useCallback, useState, useMemo } from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import Link from '$shared/components/Link'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import LogoItem from '../Nav/LogoItem'
import Avatar from '$shared/components/Avatar'
import { isEthereumAddress } from '$mp/utils/validate'
import { truncate } from '$shared/utils/text'
import Bar from './Bar'
import Hamburger from './Hamburger'
import routes from '$routes'
import { docsLinks } from '$shared/../links'
import styles from './mobileNav.pcss'

type StateProps = {
    currentUser: ?User,
}

type Props = StateProps & {
    className?: ?string,
    location: Location,
}

const MobileNav = withRouter(({ location: { pathname: redirect }, className }: Props) => {
    const currentUser = useSelector(selectUserData)
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

    const isEthAddress = !!currentUser && isEthereumAddress(currentUser.username)

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
                {!!currentUser && (
                    <div className={styles.userWrapper}>
                        <Avatar
                            alt={currentUser.name}
                            className={styles.avatar}
                            src={currentUser.imageUrlSmall}
                        />
                        <div className={styles.user}>
                            <div className={styles.name}>
                                {currentUser.name}
                            </div>
                            <div className={styles.username}>
                                {!isEthAddress && (currentUser.username)}
                                {!!isEthAddress && (truncate(currentUser.username, {
                                    maxLength: 20,
                                }))}
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.items}>
                    <ul>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.streams()}
                            >
                                <Translate value="general.core" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.marketplace()}
                            >
                                <Translate value="general.marketplace" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.link}
                                to={docsLinks.docs}
                            >
                                <Translate value="general.docs" />
                            </Link>
                        </li>
                    </ul>
                    <ul className={styles.settings}>
                        <li>
                            <Link
                                className={styles.link}
                                to={routes.editProfile()}
                                disabled={!currentUser}
                            >
                                <Translate value="general.settings" />
                                <SvgIcon name="forward" className={styles.settingsIcon} />
                            </Link>
                        </li>
                    </ul>
                    {!!currentUser && (
                        <ul>
                            <li>
                                <Link
                                    className={styles.link}
                                    to={routes.logout()}
                                >
                                    <Translate value="general.signout" />
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
                {!currentUser && (
                    <div className={styles.signInWrapper}>
                        <Button
                            kind="primary"
                            tag={Link}
                            className={styles.signUpLink}
                            to={routes.signUp()}
                        >
                            <Translate value="general.signUp" />
                        </Button>
                        <div className={styles.signIn}>
                            Already have an account?
                            &nbsp;
                            <Link
                                to={routes.login(redirect !== '/' ? {
                                    redirect,
                                } : {})}
                            >
                                <Translate value="general.signIn" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
})

export default MobileNav
