import React from 'react'
import { StreamPermission } from '@streamr/sdk'
import styled from 'styled-components'
import Surround from '~/shared/components/Surround'
import Label from '~/shared/components/Ui/Label'
import Select from '~/shared/components/Ui/Select'
import Text from '~/shared/components/Ui/Text'
import { useCurrentStreamAbility } from '~/shared/stores/streamAbilities'
import { PHONE } from '~/shared/utils/styled'
import { StreamDraft, getEmptyStreamEntity } from '~/stores/streamDraft'
import { getEnvironmentConfig } from '~/getters/getEnvironmentConfig'
import Section from '../Section'
import { ENS_DOMAINS_URL, EditableStreamId, ReadonlyStreamId } from './StreamId'

export function InfoSection({ disabled: disabledProp = false }) {
    const {
        id: streamId,
        metadata,
        chainId,
    } = StreamDraft.useEntity({ hot: true }) || getEmptyStreamEntity()

    const { description } = metadata

    const canEdit = useCurrentStreamAbility(streamId, StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const update = StreamDraft.useUpdateEntity()

    const chainOptions = getEnvironmentConfig().availableChains.map(
        ({ id: value, name: label }) => ({
            value,
            label,
        }),
    )

    return (
        <Section title="Details">
            <Description>
                All streams have a unique id in the format{' '}
                <strong>domain/pathname</strong>.
                <Surround head=" " tail=" ">
                    The domain part can be your Ethereum address or an ENS name you own.
                </Surround>
                <Surround>
                    <a
                        href={ENS_DOMAINS_URL}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        Need an ENS name?
                    </a>
                </Surround>
            </Description>
            <Row>
                {streamId ? (
                    <ReadonlyStreamId streamId={streamId} />
                ) : (
                    <EditableStreamId disabled={disabled} />
                )}
            </Row>
            {!streamId && (
                <Row>
                    <Label htmlFor="chain">Chain</Label>
                    <ChainSelectWrap>
                        <Select
                            disabled={disabled}
                            name="chain"
                            onChange={(option) => {
                                if (!option) {
                                    return
                                }

                                const { value } = option

                                update((hot, cold) => {
                                    hot.chainId = value

                                    cold.chainId = value
                                })
                            }}
                            options={chainOptions}
                            value={chainOptions.find(({ value }) => value === chainId)}
                        />
                    </ChainSelectWrap>
                </Row>
            )}
            <Row>
                <Label htmlFor="streamDescription">Description</Label>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
                    placeholder="Add a brief description"
                    value={description}
                    onChange={({ target }) => {
                        update((draft) => {
                            draft.metadata.description = target.value
                        })
                    }}
                    disabled={disabled}
                    autoComplete="off"
                />
            </Row>
        </Section>
    )
}

const Row = styled.div`
    & + & {
        margin-top: 2rem;
    }

    input[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`

const ChainSelectWrap = styled.div`
    @media ${PHONE} {
        max-width: 222px;
    }
`
