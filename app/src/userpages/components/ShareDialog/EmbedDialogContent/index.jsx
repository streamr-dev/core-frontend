// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import useEmbed from '$userpages/hooks/useEmbed'
import useCopy from '$shared/hooks/useCopy'
import Dialog from '$shared/components/Dialog'
import type { ResourceType, ResourceId } from '$userpages/flowtype/permission-types'

import dialogStyles from '../shareDialog.pcss'
import ShareDialogTabs from '../ShareDialogTabs'

import styles from './embedDialogContent.pcss'

type Props = {
    resourceType: ResourceType,
    resourceId: ResourceId,
    onClose: () => void,
    setActiveTab: Function,
}

const EmbedDialogContent = (props: Props) => {
    const { onClose, resourceType, resourceId, setActiveTab } = props
    const { embedCode } = useEmbed(resourceType, resourceId)
    const { isCopied, copy } = useCopy()

    const onCopy = useCallback(() => {
        if (!isCopied) {
            copy(embedCode)
        }
    }, [isCopied, copy, embedCode])

    const buttonText = isCopied ? I18n.t('modal.shareResource.copied') : I18n.t('modal.shareResource.copy')

    return (
        <Dialog
            containerClassname={dialogStyles.dialog}
            contentClassName={dialogStyles.content}
            onClose={onClose}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    type: 'link',
                    onClick: onClose,
                },
                copy: {
                    title: buttonText,
                    type: 'primary',
                    onClick: onCopy,
                },
            }}
        >
            <ShareDialogTabs
                active={ShareDialogTabs.EMBED}
                onChange={() => setActiveTab(ShareDialogTabs.SHARE)}
                allowEmbed
            />
            <div className={cx(styles.root, styles.EmbedDialogContent)}>
                <div className={styles.inner}>
                    <label className={styles.label}>
                        <Translate value="modal.shareResource.embedCode" />
                        <br />
                        <textarea className={styles.textarea} value={embedCode} readOnly />
                    </label>
                </div>
            </div>
        </Dialog>
    )
}

export default EmbedDialogContent
