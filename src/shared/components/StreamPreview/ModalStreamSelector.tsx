import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components'
import useModal, { ModalApi } from '~/shared/hooks/useModal'
import ModalPortal from '~/shared/components/ModalPortal'
import ModalDialog from '~/shared/components/ModalDialog'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { Button } from '~/components/Button'
import { truncateStreamName } from '~/shared/utils/text'
import SvgIcon from '../SvgIcon'

type StreamSelectorProps = {
    streamIds: string[]
    selectedStream: string
    onChange: (streamId: string) => void
}

type StreamSelectorModalProps = StreamSelectorProps & {
    api: ModalApi
}

const ModalContainer = styled.div`
    background: white;
    color: ${COLORS.primary};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const Header = styled.div`
    padding: 44px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const HeaderTitle = styled.p`
    font-size: 24px;
    margin: 0;
`

const StreamsList = styled.ul`
    width: 100%;
    list-style-type: none;
    padding: 0;

    li {
        font-size: 16px;
        padding: 8px 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid ${COLORS.separator};
        &:last-of-type {
            border-bottom: 1px solid ${COLORS.separator};
        }

        &.active {
            background-color: ${COLORS.primaryLight};
            color: white;
        }
    }
`

const StreamName = styled.div`
    background-color: white;
    font-size: 16px;
    font-weight: ${MEDIUM};
    line-height: 40px;
    padding: 0 12px;
`

const SelectorWrapper = styled.div`
    display: flex;
    align-items: center;
`

export const ModalStreamSelector: FunctionComponent<StreamSelectorProps> = (props) => {
    const { api, isOpen } = useModal('streamSelectorModal')
    const openModal = useCallback(() => {
        api.open()
    }, [api])
    return (
        <div>
            <SelectorWrapper>
                <StreamName onClick={openModal}>
                    {props.selectedStream && truncateStreamName(props.selectedStream)}
                </StreamName>
            </SelectorWrapper>
            {isOpen && <StreamSelectorModal api={api} {...props} />}
        </div>
    )
}

const StreamSelectorModal: FunctionComponent<StreamSelectorModalProps> = ({
    api,
    streamIds,
    selectedStream,
    onChange,
}) => {
    const onClose = useCallback(() => {
        api.close()
    }, [api])
    return (
        <ModalPortal>
            <ModalDialog onClose={onClose} fullpage noScroll={false} closeOnEsc={true}>
                <ModalContainer>
                    <Header>
                        <HeaderTitle>Select a stream</HeaderTitle>
                        <Button onClick={onClose} kind={'secondary'}>
                            Done
                        </Button>
                    </Header>
                    <StreamsList>
                        {streamIds.map((streamId, index) => {
                            return (
                                <li
                                    key={index}
                                    className={
                                        streamId === selectedStream ? 'active' : ''
                                    }
                                    onClick={() => {
                                        onChange(streamId)
                                        onClose()
                                    }}
                                >
                                    <span>{truncateStreamName(streamId)}</span>
                                    {streamId === selectedStream && (
                                        <SvgIcon name={'checkMarkMono'} />
                                    )}
                                </li>
                            )
                        })}
                    </StreamsList>
                </ModalContainer>
            </ModalDialog>
        </ModalPortal>
    )
}
