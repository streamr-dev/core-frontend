import React, { useContext } from 'react'
import styled from 'styled-components'
import Editor from "rich-markdown-editor"
import light from 'rich-markdown-editor/dist/styles/theme'
import MarkdownEditor from '$mp/components/MarkdownEditor'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { COLORS } from '$shared/utils/styled'
import { ProjectHeroDescriptionStyles } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
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
    link: COLORS.link
}

const ProductDescription2 = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useEditableProductActions()
    return (
        <DescriptionEditor readOnly={disabled}
            defaultValue={product.description || ''}
            theme={customTheme}
            placeholder={'Type something great about your project...'}
            disableExtensions={["table", "td", "th", "tr", "emoji", "container_notice", "image", "hr",
                "embed", "checkbox_item", "checkbox_list", "heading", "placeholder", "highlight" ]}
            onChange={(getValue) => {
                updateDescription(getValue())
            }
            }/>
    )
}

export default ProductDescription2
