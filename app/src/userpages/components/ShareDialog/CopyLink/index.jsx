// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useCopy from '$shared/hooks/useCopy'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './copyLink.pcss'

const CopyLink = () => {
    const { isCopied, copy } = useCopy()

    return (
        <button
            type="button"
            className={cx(styles.root, styles.copyLink, {
                [styles.copied]: !!isCopied,
            })}
            onClick={() => copy('plaa')}
        >
            {!isCopied && (
                <Translate value="modal.shareResource.copyLink" />
            )}
            {!!isCopied && (
                <span>
                    <Translate value="modal.shareResource.linkCopied" />
                    <SvgIcon name="tick" className={styles.tick} />
                </span>
            )}
        </button>
    )
}

export default CopyLink
