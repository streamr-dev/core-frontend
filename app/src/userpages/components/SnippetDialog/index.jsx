import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import DropdownActions from '$shared/components/DropdownActions'
import { CodeSnippet } from '@streamr/streamr-layout'

import { ProgrammingLanguages, StreamrClientRepositories } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'

import styles from './snippetDialog.pcss'

const SnippetLanguageMappings = {
    [ProgrammingLanguages.JAVASCRIPT]: 'javascript',
    [ProgrammingLanguages.JAVA]: 'java',
}

const SnippetDialog = ({ snippets, onClose }) => {
    const { isCopied, copy } = useCopy()
    const [selectedLanguage, setSelectedLanguage] = useState(undefined)

    const onSelectLanguage = useCallback((language) => {
        setSelectedLanguage(language)
    }, [])

    const snippetLanguages = useMemo(() => Object.keys(snippets), [snippets])

    useEffect(() => {
        if (!selectedLanguage) {
            setSelectedLanguage(snippetLanguages.length > 0 && snippetLanguages[0])
        }
    }, [selectedLanguage, snippetLanguages])

    const onCopy = useCallback(() => {
        if (selectedLanguage && snippets[selectedLanguage]) {
            copy(snippets[selectedLanguage])
        }
    }, [snippets, selectedLanguage, copy])

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
                            <DropdownActions title={
                                <span className={styles.languageTitle}>{selectedLanguage}</span>
                            }
                            >
                                {snippetLanguages.map((language) => (
                                    <DropdownActions.Item
                                        key={language}
                                        onClick={() => onSelectLanguage(language)}
                                    >
                                        {language}
                                    </DropdownActions.Item>
                                ))}
                            </DropdownActions>
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
                        language={SnippetLanguageMappings[selectedLanguage]}
                        showLineNumbers
                        className={styles.codeSnippet}
                    >
                        {snippets[selectedLanguage]}
                    </CodeSnippet>
                )}
            </Dialog>
        </ModalPortal>
    )
}

export default SnippetDialog
