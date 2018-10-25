// @flow

import React from 'react'
import cx from 'classnames'

import styles from './footer.pcss'

type Props = {
    className?: string,
}

// FIXME(mr): Replace "Made with…" with a translation. #i18n
const Footer = ({ className }: Props) => (
    <div className={cx(className, styles.root)}>
        <div className={styles.inner}>
            Made with
            <span role="img" aria-label="love"> ❤️ </span>
            &
            <span role="img" aria-label="coffee"> ☕️ </span>
            by Streamr Network AG in 2018
        </div>
    </div>
)

export default Footer
