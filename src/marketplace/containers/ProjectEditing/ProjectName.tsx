import React, { useContext, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components'
import { ProjectHeroTitleStyles } from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import TextField from '~/shared/components/Ui/TextField'
import { COLORS } from '~/shared/utils/styled'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
type Props = {
    disabled?: boolean
}

const ProjectNameInputContainer = styled.div`
    ${ProjectHeroTitleStyles};
`

const ProjectNameInput = styled(TextField)`
    padding: 0;
    border: none;
    line-height: 44px;
    font-size: 34px;

    &:not(:disabled):focus {
        border: none;
    }

    ::placeholder {
        color: ${COLORS.primaryDisabled};
    }
`

const ProjectName = ({ disabled }: Props) => {
    const { state: product } = useContext(ProjectStateContext)
    const { updateName } = useEditableProjectActions()
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
                value={product.name || ''}
                onChange={onChange}
                autoFocus
            />
        </ProjectNameInputContainer>
    )
}

export default ProjectName
