// @flow

import React, { type Node } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/styles/hljs'
import cx from 'classnames'

import styles from '../CodeSnippet/codeSnippet.pcss'

type Props = {
    language?: string,
    wrapLines?: boolean,
    showLineNumbers?: boolean,
    className?: string,
    children?: Node,
}

const CodeSnippet = ({
    language,
    wrapLines,
    showLineNumbers,
    className,
    children,
}: Props) => (
    <SyntaxHighlighter
        language={language}
        style={githubGist}
        wrapLines={wrapLines}
        showLineNumbers={showLineNumbers}
        className={cx(styles.codeSnippet, className)}
    >{children}{/* eslint-disable-line react/jsx-closing-tag-location */}</SyntaxHighlighter>
)

CodeSnippet.defaultProps = {
    wrapLines: true,
    showLineNumbers: false,
}

export default CodeSnippet
