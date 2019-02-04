// @flow

import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import type { ResourceId } from '../../flowtype/permission-types'

import styles from './snippetDialog.pcss'

type GivenProps = {
    resourceId: ResourceId,
    resourceTitle: string,
    onClose: () => void,
}

type Props = GivenProps

export class SnippetDialog extends Component<Props> {
    onSave = () => {}

    render() {
        const { resourceId, resourceTitle, onClose } = this.props

        // $FlowFixMe It's alright but Flow doesn't get it
        const snippetTemplate = String.raw`
streamr.subscribe({
    stream: '${resourceId}'
},
(message, metadata) => {
    // Do something with the message here!
    console.log(message)
}
`

        return (
            <Modal>
                <Dialog
                    contentClassName={styles.content}
                    title={I18n.t('modal.copySnippet.defaultTitle', {
                        resourceTitle,
                    })}
                    onClose={onClose}
                >
                    <pre> {snippetTemplate} </pre>
                    <div className={styles.footer}>
                        <div className={styles.language}>Javascript</div>
                        <div className={styles.library}>Go to library</div>
                        <div className={styles.buttons}>
                            <Buttons
                                className={styles.noPadding}
                                actions={{
                                    copy: {
                                        title: 'Copy',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </Dialog>
            </Modal>
        )
    }
}

export default SnippetDialog
