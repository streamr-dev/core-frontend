import React, { useState } from 'react'
import styled from 'styled-components'
import UnstyledRichMarkdownEditor, {
    Props as RichMarkdownEditorProps,
} from 'rich-markdown-editor'
import light from 'rich-markdown-editor/dist/styles/theme'
import { COLORS } from '~/shared/utils/styled'

const RichMarkdownEditor = styled(UnstyledRichMarkdownEditor)`
    justify-content: flex-start;

    .block-menu-trigger {
        align-items: center;
        display: flex;
        justify-content: center;
    }
`

const defaultTheme = {
    ...light,
    toolbarBackground: COLORS.primaryContrast,
    toolbarHoverBackground: COLORS.primaryDisabled,
    toolbarItem: COLORS.primaryLight,
    placeholder: COLORS.primaryDisabled,
    link: COLORS.link,
}

const defaultDisabledExtensions: NonNullable<
    RichMarkdownEditorProps['disableExtensions']
> = [
    'table',
    'td',
    'th',
    'tr',
    'emoji',
    'container_notice',
    'image',
    'hr',
    'embed',
    'checkbox_item',
    'checkbox_list',
    'heading',
    'placeholder',
    'highlight',
]

interface Props
    extends Omit<
        RichMarkdownEditorProps,
        'embeds' | 'onClickLink' | 'tooltip' | 'onChange'
    > {
    onChange?: (value: string) => void
}

export default function RichTextEditor({
    theme = defaultTheme,
    disableExtensions = defaultDisabledExtensions,
    onChange,
    ...props
}: Props) {
    return (
        <RichMarkdownEditor
            {...props}
            disableExtensions={disableExtensions}
            onChange={(getValue) => {
                onChange?.(getValue().trim())
            }}
            theme={theme}
        />
    )
}
