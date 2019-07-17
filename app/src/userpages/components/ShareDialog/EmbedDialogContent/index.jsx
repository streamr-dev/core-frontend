// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import useEmbed from '$userpages/hooks/useEmbed'

import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'

import styles from './embedDialogContent.pcss'

type Props = {
    resourceType: ResourceType,
    resourceId: ResourceId,
}

const EmbedDialogContent = ({ resourceType, resourceId }: Props) => {
    const { embedCode } = useEmbed(resourceType, resourceId)

    return (
        <div className={cx(styles.root, styles.EmbedDialogContent)}>
            <div className={styles.inner}>
                <label className={styles.label}>
                    <Translate value="modal.shareResource.embedCode" />
                    <br />
                    <textarea className={styles.textarea} value={embedCode} readOnly />
                </label>
            </div>
        </div>
    )
}

export default EmbedDialogContent
