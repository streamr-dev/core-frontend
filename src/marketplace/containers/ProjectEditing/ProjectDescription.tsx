import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import Editor from 'rich-markdown-editor'
import light from 'rich-markdown-editor/dist/styles/theme'
import { COLORS } from '~/shared/utils/styled'
import { ProjectHeroDescriptionStyles } from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'
import useValidation from '../ProductController/useValidation'
type Props = {
    disabled?: boolean
}

const DescriptionEditor = styled(Editor)`
    ${ProjectHeroDescriptionStyles};
    justify-content: flex-start;

    .block-menu-trigger {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

const customTheme = {
    ...light,
    toolbarBackground: COLORS.primaryContrast,
    toolbarHoverBackground: COLORS.primaryDisabled,
    toolbarItem: COLORS.primaryLight,
    placeholder: COLORS.primaryDisabled,
    link: COLORS.link,
}

const ProjectDescription: FunctionComponent<Props> = ({ disabled }) => {
    const { state: product } = useContext(ProjectStateContext)
    // const { isValid, message } = useValidation2('description')
    const { updateDescription } = useEditableProjectActions()
    return (
        <DescriptionEditor
            readOnly={disabled}
            defaultValue={product.description || ''}
            theme={customTheme}
            placeholder={'Type something great about your project...'}
            disableExtensions={[
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
            ]}
            onChange={(getValue) => {
                updateDescription(getValue().trim())
            }}
        />
    )
}

export default ProjectDescription
