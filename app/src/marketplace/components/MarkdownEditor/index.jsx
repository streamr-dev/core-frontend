// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'

import TextControl from '$shared/components/TextControl'
import InputControl from '$mp/components/InputControl'
import InputError from '$mp/components/InputError'

import styles from './markdownEditor.pcss'

type Props = {
    value?: string,
    placeholder?: string,
    onChange?: (string) => void,
    onCommit?: (string) => void,
    className?: string,
}

const MarkdownEditor = (props: Props) => {
    const { value, onChange, ...editorProps } = props
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
        <InputControl {...editorProps} value={value}>
            {({
                value: editorValue,
                hasFocus,
                onFocusChange,
                hasError,
                error,
                className,
                ...rest
            }) => (
                <React.Fragment>
                    <div
                        className={cx(styles.root, {
                            [styles.withFocus]: !!hasFocus,
                            [styles.withError]: !!hasError,
                        }, className)}
                    >
                        <TextControl
                            immediateCommit={false}
                            commitEmpty
                            tag="textarea"
                            value={editorValue}
                            onChange={onTextChange}
                            className={styles.input}
                            onBlur={onFocusChange}
                            onFocus={onFocusChange}
                            {...rest}
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
                        message={error}
                        preserved
                    />
                </React.Fragment>
            )}
        </InputControl>
    )
}

export default MarkdownEditor
