// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'

import TextControl from '$shared/components/TextControl'
import InputError from '$mp/components/InputError'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'

import styles from './markdownEditor.pcss'

type Props = LastErrorProps & {
    value?: string,
    placeholder?: string,
    onChange?: (string) => void,
    onCommit?: (string) => void,
    className?: string,
}

const MarkdownEditor = ({
    value,
    onChange,
    error,
    isProcessing,
    className,
    ...editorProps
}: Props) => {
    const [text, setText] = useState(value || '')
    const [wordCount, setWordCount] = useState(0)
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })

    const onTextChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value: newValue } = e.target
        setText(newValue)

        if (onChange != null) {
            onChange(newValue)
        }
    }, [onChange])

    useEffect(() => {
        const trimmedValue = text.trim()
        setWordCount(trimmedValue.length > 0 ? trimmedValue.split(/\s+/g).length : 0)
    }, [text])

    return (
        <React.Fragment>
            <div
                className={cx(styles.root, {
                    [styles.withError]: !!hasError,
                }, className)}
            >
                <TextControl
                    immediateCommit={false}
                    commitEmpty
                    tag="textarea"
                    value={value}
                    onChange={onTextChange}
                    className={styles.input}
                    {...editorProps}
                />
                <div className={styles.footer}>
                    <div>
                        <span className={styles.bold}>*bold*</span>
                        <span className={styles.italic}>_italics_</span>
                        <span className={styles.code}>`code`</span>
                        <span>&gt;quote</span>
                        <span>#Headline 1</span>
                        <span>##Headline 2</span>
                        <span>* bullet point</span>
                    </div>
                    <div className={styles.wordCount}>
                        {wordCount} words
                    </div>
                </div>
            </div>
            <InputError
                eligible={hasError}
                message={lastError}
                preserved
            />
        </React.Fragment>
    )
}

export default MarkdownEditor
