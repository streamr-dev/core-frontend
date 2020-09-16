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

const Md = ({
    allowedTypes,
    children,
    escapeHtml = true,
    inline,
    unwrapDisallowed = true,
    ...props
}) => (
    <ReactMarkdown
        {...props}
        allowedTypes={allowedTypes || (inline ? INLINE_TYPES : BLOCK_TYPES)}
        escapeHtml={escapeHtml}
        source={children}
        unwrapDisallowed={unwrapDisallowed}
    />
)

export default Md

