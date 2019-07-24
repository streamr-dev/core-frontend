// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'

import styles from './markdownEditor.pcss'

type Props = {
    placeholder?: string,
    onChange?: (string) => void,
    className?: string,
}

const MarkdownEditor = ({ placeholder, onChange, className }: Props) => {
    const [text, setText] = useState('')
    const [wordCount, setWordCount] = useState(0)

    const onTextChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        setText(value)

        if (onChange != null) {
            onChange(value)
        }
    }, [onChange])

    useEffect(() => {
        const trimmedValue = text.trim()
        setWordCount(trimmedValue.length > 0 ? trimmedValue.split(/\s+/g).length : 0)
    }, [text])

    return (
        <div className={styles.root}>
            <textarea
                className={cx(styles.input, className)}
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
