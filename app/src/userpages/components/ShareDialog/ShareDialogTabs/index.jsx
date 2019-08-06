// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import styles from './shareDialogTabs.pcss'

export type Tab = 'share' | 'embed'

type Props = {
    active: Tab,
    onChange: (Tab) => void,
    allowEmbed?: boolean,
}

type LabelProps = {
    id: string,
}

const Label = ({ id }: LabelProps) => (
    <div className={styles.label}>
        <Translate value={`modal.shareResource.tabs.${id}`} />
    </div>
)

export const ShareDialogTabs = ({ active, onChange, allowEmbed }: Props) => (
    <div className={cx(styles.root, styles.shareDialogTabs)}>
        {[ShareDialogTabs.SHARE, ShareDialogTabs.EMBED].map((tab) => (
            <button
                type="button"
                onClick={() => onChange(tab)}
                key={tab}
                className={cx(styles.tab, {
                    [styles.active]: active === tab,
                    [styles.disabled]: tab === ShareDialogTabs.EMBED && !allowEmbed,
                })}
            >
                <Label id={tab} />
            </button>
        ))}
    </div>
)

ShareDialogTabs.SHARE = 'share'
ShareDialogTabs.EMBED = 'embed'

export default ShareDialogTabs
