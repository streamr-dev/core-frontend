// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import Link from '../Link'
import List from '../List'
import Text from '../Text'
import SvgIcon from '../SvgIcon'
import routes from '$routes'
import styles from './backButton.pcss'

type Props = {
    className?: string,
    href?: string,
    to?: string,
}

const BackButton = ({ className, ...props }: Props) => (
    <div
        className={cx([
            styles.root,
            className,
            Text.styles.uppercase,
            Text.styles.spaced,
            Text.styles.plexMono,
        ])}
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
                    to={routes.account({
                        tab: 'products',
                    })}
                >
                    <Translate value="general.myProducts" />
                </Link>
            </li>
            <li>
                <Link
                    to={routes.account({
                        tab: 'purchases',
                    })}
                >
                    <Translate value="general.myPurchases" />
                </Link>
            </li>
        </List>
    </div>
)

export default BackButton
