// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import Link from '../Link'
import List from '../List'
import SvgIcon from '../SvgIcon'
import routes from '$routes'
import links from '$mp/../links'
import styles from './backButton.pcss'

type Props = {
    className?: string,
    href?: string,
    to?: string,
}

const BackToProductsButton = ({ className, ...props }: Props) => (
    <div
        className={cx(styles.root, className)}
    >
        &zwnj;
        <List
            className={styles.list}
        >
            <li>
                <Link
                    to={routes.marketplace()}
                    {...props}
                >
                    <SvgIcon name="back" className={styles.backIcon} />
                    <span className={styles.shortLabel}>
                        <Translate value="general.back" />
                    </span>
                    <span className={styles.longLabel}>
                        <Translate value="general.backToMarketplace" />
                    </span>
                </Link>
            </li>
            <li>
                <Link
                    to={links.userpages.products}
                >
                    <Translate value="general.products" />
                </Link>
            </li>
            <li>
                <Link
                    to={links.userpages.purchases}
                >
                    <Translate value="general.purchases" />
                </Link>
            </li>
        </List>
    </div>
)

export default BackToProductsButton
