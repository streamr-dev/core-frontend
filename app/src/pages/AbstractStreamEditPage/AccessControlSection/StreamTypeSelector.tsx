import React from 'react'
import styled from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'
import { Bits, useStreamEditorStore } from '$app/src/shared/stores/streamEditor'
import useStreamId from '$app/src/shared/hooks/useStreamId'
import { StreamPermission } from 'streamr-client'
import address0 from '$utils/address0'

const Container = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
`

const Item = styled.div`
    background: #ffffff;
    border-radius: 4px;
    height: 100px;
    display: flex;
    align-items: center;
`

const Radio = styled.input`
    width: 16px;
    justify-self: center;
    align-self: center;
`

const RadioContainer = styled.label`
    width: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 48px auto 48px;
`

const Title = styled.div`
    font-weight: ${MEDIUM};
    font-size: 16px;
    line-height: 20px;
`

const Description = styled.div`
    font-size: 14px;
    line-height: 24px;
`

enum StreamType {
    Public = 'public',
    Private = 'private',
}

type Props = {
    disabled?: boolean,
}

export default function StreamTypeSelector({ disabled }: Props) {
    const setPermissions = useStreamEditorStore(({ setPermissions }) => setPermissions)

    const streamId = useStreamId()

    const bits = useStreamEditorStore(({ cache }) => streamId ? cache[streamId]?.permissions?.[address0]?.bits || null : null)

    const streamType = bits ? StreamType.Public : StreamType.Private

    return (
        <Container>
            <Item>
                <RadioContainer htmlFor="public">
                    <Radio
                        id="public"
                        type="radio"
                        name="streamType"
                        checked={streamType === StreamType.Public}
                        onChange={() => {
                            if (!streamId) {
                                return
                            }

                            setPermissions(streamId, address0, Bits[StreamPermission.SUBSCRIBE])
                        }}
                        disabled={disabled}
                    />
                    <div>
                        <Title>Public stream</Title>
                        <Description>Anyone can subscribe to the stream</Description>
                    </div>
                </RadioContainer>
            </Item>
            <Item>
                <RadioContainer htmlFor="private">
                    <Radio
                        id="private"
                        type="radio"
                        name="streamType"
                        checked={streamType === StreamType.Private}
                        onChange={() => {
                            if (!streamId) {
                                return
                            }

                            setPermissions(streamId, address0, null)
                        }}
                        disabled={disabled}
                    />
                    <div>
                        <Title>Private stream</Title>
                        <Description>Only Ethereum accounts listed below can subscribe to the stream.</Description>
                    </div>
                </RadioContainer>
            </Item>
        </Container>
    )
}
