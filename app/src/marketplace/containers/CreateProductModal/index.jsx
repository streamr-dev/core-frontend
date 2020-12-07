// @flow

import React, { useCallback } from 'react'
import styled from 'styled-components'

import useModal from '$shared/hooks/useModal'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import SvgIcon from '$shared/components/SvgIcon'

type Props = {
    api: Object,
}

const CloseButton = styled.button`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: var(--greyDark);
    line-height: 14px;
    cursor: pointer;
    padding: 0.5rem;
    margin: 0;
    background: none;
    outline: none;
    border: none;

    &:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }

    & > svg {
        width: 14px;
        height: 14px;
    }
`

const StyledProductTypeChooser = styled(ProductTypeChooser)`
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
                <CloseButton
                    type="button"
                    onClick={onClose}
                >
                    <SvgIcon name="crossMedium" />
                </CloseButton>
                <StyledProductTypeChooser />
            </ModalDialog>
        </ModalPortal>
    )
}

export default () => {
    const { api, isOpen } = useModal('marketplace.createProduct')

    if (!isOpen) {
        return null
    }

    return (
        <CreateProductModal
            api={api}
        />
    )
}
