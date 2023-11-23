import React, { useCallback } from 'react'
import styled from 'styled-components'
import useModal from '~/shared/hooks/useModal'
import { ProjectTypeChooser } from '~/marketplace/components/ProjectTypeChooser'
import ModalPortal from '~/shared/components/ModalPortal'
import ModalDialog from '~/shared/components/ModalDialog'
type Props = {
    api: Record<string, any>
}
const StyledProjectTypeChooser = styled(ProjectTypeChooser)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const CreateProjectModal = ({ api }: Props) => {
    const onClose = useCallback(() => {
        api.close()
    }, [api])
    return (
        <ModalPortal>
            <ModalDialog onClose={onClose} fullpage>
                <StyledProjectTypeChooser onClose={onClose} />
            </ModalDialog>
        </ModalPortal>
    )
}

const CreateProjectModalWrap = () => {
    const { api, isOpen } = useModal('marketplace.createProduct')

    if (!isOpen) {
        return null
    }

    return <CreateProjectModal api={api} />
}

export default CreateProjectModalWrap
