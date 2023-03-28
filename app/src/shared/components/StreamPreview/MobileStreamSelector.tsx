import React, {FunctionComponent, useCallback} from "react"
import styled from "styled-components"
import useModal, {ModalApi} from "$shared/hooks/useModal"
import ModalPortal from "$shared/components/ModalPortal"
import ModalDialog from "$shared/components/ModalDialog"
import {CopyButton} from "$shared/components/CopyButton/CopyButton"
import {Provider as ModalContextProvider} from "$shared/contexts/ModalApi"

type MobileStreamSelectorProps = {
    streamIds: string[]
}

type MobileStreamSelectorModalProps = {
    api: ModalApi,
}

const Inner = styled.div`
    width: 100%;
    align-self: center;
    padding-top: 80px;
`

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StreamSelector: FunctionComponent<MobileStreamSelectorProps> = () => {
    const { api } = useModal('selectStream')
    const openModal = useCallback(() => api.open(), [api])
    return <>
        <SelectorWrapper>
            <div onClick={openModal}>Select</div>
            <CopyButton valueToCopy={'aaa'}/>
        </SelectorWrapper>
        <MobileStreamSelectorModal api={api} />
    </>
}

export const MobileStreamSelector: FunctionComponent<MobileStreamSelectorProps> = (props) => {
    return <ModalContextProvider>
        <StreamSelector {...props}/>
    </ModalContextProvider>
}

const MobileStreamSelectorModal: FunctionComponent<MobileStreamSelectorModalProps> = ({api}) => {
    const onClose = useCallback(() => {
        api.close()
    }, [api])
    return <ModalPortal>
        <ModalDialog onClose={onClose}>
            <Inner>
                <p>Eloszka</p>
            </Inner>
        </ModalDialog>
    </ModalPortal>
}
