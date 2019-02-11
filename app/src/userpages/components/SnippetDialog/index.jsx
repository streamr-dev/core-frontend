// @flow

import React, { Component, Fragment } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import copy from 'copy-to-clipboard'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import DropdownActions from '$shared/components/DropdownActions'
import CodeSnippet from '$shared/components/CodeSnippet'

import { ProgrammingLanguages, StreamrClientRepositories } from '$shared/utils/constants'

import styles from './snippetDialog.pcss'

type Language = $Values<typeof ProgrammingLanguages>

type GivenProps = {
    name: string,
    snippets: {
        [Language]: string,
    },
    onClose: () => void,
}

type Props = GivenProps

type State = {
    selectedLanguage?: Language,
    copied: boolean,
}

const SnippetLanguageMappings = {
    [ProgrammingLanguages.JAVASCRIPT]: 'javascript',
    [ProgrammingLanguages.JAVA]: 'java',
}

export class SnippetDialog extends Component<Props, State> {
    state = {
        selectedLanguage: undefined,
        copied: false,
    }

    timeout: ?TimeoutID = null

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }

    onSave = () => {}

    onSelectLanguage = (language: Language) => {
        this.setState({
            selectedLanguage: language,
            copied: false,
        })
    }

    onCopy = () => {
        const { snippets } = this.props
        const snippetLanguages = Object.keys(snippets)
        const selectedLanguage = this.state.selectedLanguage || (snippetLanguages.length > 0 && snippetLanguages[0])

        if (selectedLanguage) {
            copy(snippets[selectedLanguage])

            this.setState({
                copied: true,
            })
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            this.timeout = setTimeout(() => {
                this.setState({
                    copied: false,
                })
            }, 3000)
        }
    }

    render() {
        const { name, snippets, onClose } = this.props
        const snippetLanguages = Object.keys(snippets)
        const selectedLanguage = this.state.selectedLanguage || (snippetLanguages.length > 0 && snippetLanguages[0])

        return (
            <Modal>
                <Dialog
                    contentClassName={styles.content}
                    title={I18n.t('modal.copySnippet.defaultTitle', {
                        name,
                    })}
                    onClose={onClose}
                    showCloseIcon
                >
                    {selectedLanguage && (
                        <Fragment>
                            <CodeSnippet
                                language={SnippetLanguageMappings[selectedLanguage]}
                                showLineNumbers
                                className={styles.codeSnippet}
                            >
                                {snippets[selectedLanguage]}
                            </CodeSnippet>
                            <div className={styles.footer}>
                                <div className={styles.language}>
                                    <DropdownActions title={
                                        <span className={styles.languageTitle}>{selectedLanguage}</span>
                                    }
                                    >
                                        {snippetLanguages.map((language: Language) => (
                                            <DropdownActions.Item
                                                key={language}
                                                onClick={() => this.onSelectLanguage(language)}
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
                                                title: I18n.t(`modal.copySnippet.${this.state.copied ? 'copied' : 'copy'}`),
                                                onClick: this.onCopy,
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    )}
                </Dialog>
            </Modal>
        )
    }
}

export default SnippetDialog
