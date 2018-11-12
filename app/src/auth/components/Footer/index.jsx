// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import styles from './footer.pcss'

type Props = {
    className?: string,
}

const Footer = ({ className }: Props) => (
    <div className={cx(className, styles.root)}>
        <div className={styles.inner}>
            <Translate value="general.footnote" />
        </div>
    </div>
)

export default Footer
