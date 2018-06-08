// @flow

import React from 'react'
import classNames from 'classnames'
import { Translate } from 'react-redux-i18n'
import Icon from '../../Icon'
// import links from '../../../../../links'
import styles from './badge.pcss'

const links = {
    community: {},
}

type Props = {
    id: string,
    disabled?: boolean,
}

const Badge = ({ id, disabled }: Props) => (
    <div className={classNames(styles.badge, disabled && styles.disabled)}>
        <a href={links.community[id]} target="_blank" rel="noopener noreferrer">
            <Icon name={id} className={styles.icon} />
            <div className={styles.labelWrapper}>
                <div className={styles.label}>
                    <Translate value={`navbar.social.${id}`} />
                </div>
            </div>
        </a>
    </div>
)

export default Badge
