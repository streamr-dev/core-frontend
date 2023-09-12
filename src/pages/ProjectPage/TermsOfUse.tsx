import React from 'react'
import styled from 'styled-components'
import { Tick } from '~/shared/components/Checkbox'
import Label from '~/shared/components/Ui/Label'
import Input from '~/shared/components/Ui/Text/StyledInput'
import { useProject, useUpdateProject } from '~/shared/stores/projectEditor'

export default function TermsOfUse() {
    const update = useUpdateProject()

    const {
        termsOfUse: {
            redistribution = false,
            commercialUse = false,
            reselling = false,
            storage = false,
            termsUrl,
            termsName,
        },
    } = useProject({ hot: true })

    return (
        <>
            <Checkboxes>
                <TickButton
                    type="button"
                    onClick={() => {
                        update(({ termsOfUse }) => {
                            termsOfUse.redistribution = !termsOfUse.redistribution
                        })
                    }}
                >
                    <Tick $checked={redistribution} />
                    <span>Redistribution</span>
                </TickButton>
                <TickButton
                    type="button"
                    onClick={() => {
                        update(({ termsOfUse }) => {
                            termsOfUse.commercialUse = !termsOfUse.commercialUse
                        })
                    }}
                >
                    <Tick $checked={commercialUse} />
                    <span>Commercial use</span>
                </TickButton>
                <TickButton
                    type="button"
                    onClick={() => {
                        update(({ termsOfUse }) => {
                            termsOfUse.reselling = !termsOfUse.reselling
                        })
                    }}
                >
                    <Tick $checked={reselling} />
                    <span>Reselling</span>
                </TickButton>
                <TickButton
                    type="button"
                    onClick={() => {
                        update(({ termsOfUse }) => {
                            termsOfUse.storage = !termsOfUse.storage
                        })
                    }}
                >
                    <Tick $checked={storage} />
                    <span>Storage</span>
                </TickButton>
            </Checkboxes>
            <Links>
                <div>
                    <Label>Link to detailed terms‌</Label>
                    <Input
                        type="text"
                        placeholder="Add a URL"
                        value={termsUrl}
                        onChange={(e) => {
                            update(({ termsOfUse }) => {
                                termsOfUse.termsUrl = e.target.value
                            })
                        }}
                    />
                </div>
                <div>
                    <Label>Display name for link‌</Label>
                    <Input
                        type="text"
                        placeholder="Add a display name"
                        value={termsName}
                        onChange={(e) => {
                            update(({ termsOfUse }) => {
                                termsOfUse.termsName = e.target.value
                            })
                        }}
                    />
                </div>
            </Links>
        </>
    )
}

const Checkboxes = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    gap: 32px;
    grid-template-columns: repeat(auto-fit, 146px);
    padding: 24px;
`

const TickButton = styled.button`
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    display: flex;
    line-height: normal;
    padding: 0;
    white-space: nowrap;

    ${Tick} {
        height: 24px;
        margin-right: 12px;
        width: 24px;
    }
`

const Links = styled.div`
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr 1fr;
    margin-top: 40px;
`
