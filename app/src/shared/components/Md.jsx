import React from 'react'
import ReactMarkdown from 'react-markdown'

const BLOCK_TYPES = [
    'blockquote',
    'break',
    'code',
    'delete',
    'emphasis',
    'inlineCode',
    'link',
    'list',
    'listItem',
    'paragraph',
    'strong',
    'text',
    'thematicBreak',
]

const INLINE_TYPES = [
    'emphasis',
    'strong',
    'text',
]

const Md = ({ children, inline, ...props }) => (
    <ReactMarkdown
        {...props}
        source={children}
        escapeHtml
        allowedTypes={inline ? INLINE_TYPES : BLOCK_TYPES}
        unwrapDisallowed
    />
)

export default Md

