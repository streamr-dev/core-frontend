import React, { useCallback } from 'react'
import styled from 'styled-components'

import { MEDIUM } from '$shared/utils/styled'
import { usePermissionsDispatch, usePermissionsState } from '$shared/components/PermissionsProvider'
import { UPDATE_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import { DEFAULTS } from '$shared/components/PermissionsProvider/groups'
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
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

type Props = {
    disabled?: boolean,
}

const StreamTypeSelector: React.FunctionComponent<Props> = ({ disabled }: Props) => {
    const dispatch = usePermissionsDispatch()
    const { changeset, combinations, resourceType } = usePermissionsState()

    const anonCombination = ({}.hasOwnProperty.call(changeset, address0) ? changeset : combinations)[address0]
    const streamType = anonCombination ? StreamType.PUBLIC : StreamType.PRIVATE

    const onChange = useCallback(
        (value: StreamType) => {
            dispatch({
                type: UPDATE_PERMISSION,
                user: address0,
                value: value === StreamType.PUBLIC ? DEFAULTS[resourceType] : undefined,
            })
        },
        [dispatch, resourceType],
    )

    return (
        <Container>
            <Item>
                <RadioContainer htmlFor="public">
                    <Radio
                        id="public"
                        type="radio"
                        name="streamType"
                        checked={streamType === StreamType.PUBLIC}
                        onChange={() => {
                            onChange(StreamType.PUBLIC)
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
                        checked={streamType === StreamType.PRIVATE}
                        onChange={() => {
                            onChange(StreamType.PRIVATE)
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

export default StreamTypeSelector
