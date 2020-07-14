import React, { useState, useCallback, useRef } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import Popover from '$shared/components/Popover'
import { CodeSnippet, titleize } from '@streamr/streamr-layout'

import { StreamrClientRepositories } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'

import styles from './snippetDialog.pcss'

const SnippetDialog = ({ snippets, onClose }) => {
    const { isCopied, copy } = useCopy()

    const [selectedLanguage, setSelectedLanguage] = useState(Object.keys(snippets)[0])

    const codeRef = useRef({})

    const onCopy = useCallback(() => {
        copy(codeRef.current[selectedLanguage] || '')
    }, [selectedLanguage, copy])

    return (
        <ModalPortal>
            <Dialog
                contentClassName={styles.content}
                title={I18n.t('modal.copySnippet.defaultTitle')}
                onClose={onClose}
                showCloseIcon
                renderActions={() => (selectedLanguage ? (
                    <div className={styles.footer}>
                        <div className={styles.language}>
                            <Popover title={
                                <span className={styles.languageTitle}>
                                    {titleize(selectedLanguage)}
                                </span>
                            }
                            >
                                {Object.keys(snippets).map((language) => (
                                    <Popover.Item
                                        key={language}
                                        onClick={() => setSelectedLanguage(language)}
                                    >
                                        {titleize(language)}
                                    </Popover.Item>
                                ))}
                            </Popover>
                        </div>
                        <div className={styles.library}>
                            <a
                                href={StreamrClientRepositories[selectedLanguage]}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                            >
                                <Translate value="modal.copySnippet.goToLibrary" />
                            </a>
                        </div>
                        <div className={styles.buttons}>
                            <Buttons
                                className={styles.noPadding}
                                actions={{
                                    copy: {
                                        title: I18n.t(`modal.copySnippet.${isCopied ? 'copied' : 'copy'}`),
                                        onClick: onCopy,
                                    },
                                }}
                            />
                        </div>
                    </div>
                ) : null)}
            >
                {selectedLanguage && (
                    <CodeSnippet
                        codeRef={codeRef}
                        language={selectedLanguage}
                        showLineNumbers
                    >
                        {snippets[selectedLanguage]}
                    </CodeSnippet>
                )}
            </Dialog>
        </ModalPortal>
    )
}

export default SnippetDialog
