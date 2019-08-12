// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'

import styles from './markdownEditor.pcss'

type Props = {
    value?: string,
    placeholder?: string,
    onChange?: (string) => void,
    className?: string,
}

const MarkdownEditor = ({ value, placeholder, onChange, className }: Props) => {
    const [text, setText] = useState(value || '')
    const [wordCount, setWordCount] = useState(0)

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
        <div className={cx(styles.root, className)}>
            <textarea
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={text}
                onChange={onTextChange}
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
    )
}

export default MarkdownEditor
