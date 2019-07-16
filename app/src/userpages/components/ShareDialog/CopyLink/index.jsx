// @flow

import React from 'react'
import cx from 'classnames'

import useCopy from '$shared/hooks/useCopy'

import styles from './copyLink.pcss'

const CopyLink = () => {
    const { isCopied, copy } = useCopy()

    return (
        <button
            type="button"
            className={cx(styles.root, styles.copyLink)}
            onClick={() => copy('plaa')}
        >
            {!isCopied && (
                <span>copy link</span>
            )}
            {!!isCopied && (
                <span>copied</span>
            )}
        </button>
    )
}

export default CopyLink
