// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import useCopy from '$shared/hooks/useCopy'
import useEmbed from '$userpages/hooks/useEmbed'
import SvgIcon from '$shared/components/SvgIcon'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'

import styles from './copyLink.pcss'

type Props = {
    resourceType: ResourceType,
    resourceId: ResourceId,
}

const CopyLink = ({ resourceType, resourceId }: Props) => {
    const { isCopied, copy } = useCopy()
    const { link } = useEmbed(resourceType, resourceId)

    return (
        <button
            type="button"
            className={cx(styles.root, styles.copyLink, {
                [styles.copied]: !!isCopied,
            })}
            onClick={() => copy(link)}
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
