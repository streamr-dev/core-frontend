import React, { useState, useCallback, useRef } from 'react'
import { CodeSnippet, titleize } from '@streamr/streamr-layout'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import Popover from '$shared/components/Popover'

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
                title="Copy Snippet"
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
                                Go to Library
                            </a>
                        </div>
                        <div className={styles.buttons}>
                            <Buttons
                                className={styles.noPadding}
                                actions={{
                                    copy: {
                                        title: isCopied ? 'Copied' : 'Copy',
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
