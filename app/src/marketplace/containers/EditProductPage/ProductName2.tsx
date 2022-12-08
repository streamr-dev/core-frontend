import React, { useContext, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components'
import { ProjectHeroTitleStyles } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import EnhancedText from '$ui/Text'
import { COLORS } from '$shared/utils/styled'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
type Props = {
    disabled?: boolean
}

const ProjectNameInputContainer = styled.div`
  ${ProjectHeroTitleStyles};`

const ProjectNameInput = styled(EnhancedText)`
  padding: 0;
  border: none;
  line-height: 44px;
  font-size: 34px;
  
  &:not(:disabled):focus {
    border: none;
  }
  
  ::placeholder {
    color: ${COLORS.primaryDisabled}
  }
`

const ProductName2 = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { isValid, message } = useValidation('name')
    const { updateName } = useEditableProductActions()
    const { publishAttempted } = useContext(EditControllerContext)
    const invalid = publishAttempted && !isValid
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            updateName(e.target.value)
            e.preventDefault()
        },
        [updateName],
    )
    return (
        <ProjectNameInputContainer>
            <ProjectNameInput
                name={'projectName'}
                disabled={disabled}
                placeholder={'Project name'}
                value={product.name}
                onChange={onChange}
                autoFocus
            />
        </ProjectNameInputContainer>
    )
}

export default ProductName2
