// @flow

import React from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './backButton.pcss'

type Props = {
    onBack: Function,
    className?: string,
}

const BackButton = ({ onBack, className }: Props) => (
    <div
        className={cx(styles.root, className)}
    >
        <button
            type="button"
            onClick={() => onBack()}
            className={styles.button}
        >
            <SvgIcon name="back" className={styles.backIcon} />
            <span>
                Back
            </span>
        </button>
    </div>
)

export default BackButton
