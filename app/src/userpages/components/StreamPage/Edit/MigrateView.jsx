// @flow

import React from 'react'
import styled, { css } from 'styled-components'

import { MEDIUM } from '$shared/utils/styled'
import type { Stream } from '$shared/flowtype/stream-types'
import UnstyledToggle from '$shared/components/Toggle'

type Props = {
    disabled: boolean,
    stream: ?Stream,
    updateStream?: Function,
}

const Description = styled.p`
    margin-bottom: 3rem;
`

const OpacityContainer = styled.div`
    ${({ disabled }) => !!disabled && css`
        opacity: 0.5;
    `}
`

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 1rem;
    background: #FFFFFF;
    padding: 24px 36px;
`

const Label = styled.label`
    font-weight: ${MEDIUM};
    font-size: 16px;
    margin-bottom: 0;
    color: #323232;
`

const Toggle = styled(UnstyledToggle)`
    display: flex;
    align-items: center;

    * {
        margin-bottom: 0;
    }
`

const LastSync = styled.div`
    color: #323232;
    font-size: 12px;
    line-height: 12px;
    margin-top: 24px;
`

export function StatusView({ disabled, stream, updateStream }: Props) {
    const { migrateToBrubeck, migrateSyncLastRunAt } = stream || {}

    return (
        <div>
            <Description>
                This stream exists in the Corea milestone network, which will be shut down on May 31st 2022.
                You can enable the below switch to automatically recreate the stream and its permissions in the new Brubeck network when it launches.
                Alternatively, you can recreate your stream and permissions manually at any time.
                <br />
                <br />
                Note that messages in the stream are not automatically copied to the new network -
                please update your data publishers to use the new network. <a href="#">Learn more</a> about migrating to Brubeck.
            </Description>
            <OpacityContainer disabled={disabled}>
                <InputContainer>
                    <Label htmlFor="migrationEnabled">
                        Sync this stream and its permissions to Brubeck
                    </Label>
                    <Toggle
                        disabled={disabled}
                        id="migrationEnabled"
                        value={migrateToBrubeck}
                        onChange={(value) => {
                            if (typeof updateStream !== 'function') {
                                return
                            }
                            updateStream({
                                migrateToBrubeck: value,
                            })
                        }}
                    />
                </InputContainer>
                <LastSync>Last synced on: {migrateSyncLastRunAt || 'N/A'}</LastSync>
            </OpacityContainer>
        </div>
    )
}

export default StatusView
