import React, { useCallback } from 'react'
import styled from 'styled-components'
import useModal from '$shared/hooks/useModal'
import { ProjectTypeChooser } from '$mp/components/ProjectTypeChooser'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
type Props = {
    api: Record<string, any>
}
const StyledProductTypeChooser = styled(ProjectTypeChooser)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const CreateProductModal = ({ api }: Props) => {
    const onClose = useCallback(() => {
        api.close()
    }, [api])
    return (
        <ModalPortal>
            <ModalDialog onClose={onClose} fullpage>
                <StyledProductTypeChooser onClose={onClose} />
            </ModalDialog>
        </ModalPortal>
    )
}

const CreateProductModalWrap = () => {
    const { api, isOpen } = useModal('marketplace.createProduct')

    if (!isOpen) {
        return null
    }

    return <CreateProductModal api={api} />
}

export default CreateProductModalWrap
