// @flow

import React from 'react'
import classNames from 'classnames'
import { Translate } from 'react-redux-i18n'
import Icon from '../../Icon'
import urls from '../../../urls'
import styles from './badge.pcss'

type Props = {
    id: string,
    disabled?: boolean,
}

const Badge = ({ id, disabled }: Props) => (
    <div className={classNames(styles.badge, disabled && styles.disabled)}>
        <a href={urls[id]} target="_blank" rel="noopener noreferrer">
            <Icon name={id} className={styles.icon} />
            <div className={styles.labelWrapper}>
                <div className={styles.label}>
                    <Translate value={`general.${id}`} />
                </div>
            </div>
        </a>
    </div>
)

export default Badge
