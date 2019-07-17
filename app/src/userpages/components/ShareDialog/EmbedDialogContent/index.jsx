// @flow

import React, { useMemo } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'

import styles from './embedDialogContent.pcss'

const getEmbedCodes = (resourceType: ResourceType, resourceId: ResourceId) => ({
    // $FlowFixMe It's alright but Flow doesn't get it
    CANVAS: String.raw`<iframe title="streamr-embed"
src="http://streamr.com/embed/${resourceType}/${resourceId}"
width="640" height="360"
frameborder="0"></iframe>`,

    DASHBOARD: '',
    STREAM: '',
})

type Props = {
    resourceType: ResourceType,
    resourceId: ResourceId,
}

const EmbedDialogContent = ({ resourceType, resourceId }: Props) => {
    const embedCode = useMemo(() => {
        const codes = getEmbedCodes(resourceType, resourceId)

        return codes[resourceType] || ''
    }, [resourceType, resourceId])

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
