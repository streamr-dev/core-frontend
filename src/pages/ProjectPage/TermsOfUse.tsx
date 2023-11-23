import React from 'react'
import styled from 'styled-components'
import { z } from 'zod'
import { Tick } from '~/shared/components/Checkbox'
import Label from '~/shared/components/Ui/Label'
import Input from '~/shared/components/Ui/Text/StyledInput'
import {
    useDraft,
    useIsProjectBusy,
    usePersistCurrentProjectDraft,
    useProject,
    useSetProjectErrors,
    useUpdateProject,
} from '~/shared/stores/projectEditor'
import { OpenDataPayload } from '~/types/projects'

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

    const { 'termsOfUse.termsUrl': termsUrlError } = useDraft()?.errors || {}

    const setErrors = useSetProjectErrors()

    const persist = usePersistCurrentProjectDraft()

    const busy = useIsProjectBusy()

    return (
        <>
            <Checkboxes>
                <TickButton
                    disabled={busy}
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
                    disabled={busy}
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
                    disabled={busy}
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
                    disabled={busy}
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
                    <Label>Link to detailed terms</Label>
                    <Input
                        disabled={busy}
                        invalid={!!termsUrlError}
                        type="text"
                        placeholder="Add a URL"
                        value={termsUrl}
                        onChange={(e) => {
                            update(({ termsOfUse }) => {
                                termsOfUse.termsUrl = e.target.value
                            })

                            if (!termsUrlError) {
                                /**
                                 * Only revalidate the URL if we're already in the red. This will prevent
                                 * on-the-fly validation before hitting submit assuming the user
                                 * knows what a URL is.
                                 */
                                return
                            }

                            try {
                                OpenDataPayload.pick({
                                    termsOfUse: true,
                                }).parse({
                                    termsOfUse: {
                                        termsUrl: e.target.value,
                                    },
                                })

                                setErrors((errors) => {
                                    delete errors['termsOfUse.termsUrl']
                                })
                            } catch (e) {
                                if (e instanceof z.ZodError) {
                                    return
                                }

                                console.warn('Failed to validate terms of use', e)
                            }
                        }}
                        onKeyDown={({ key }) => {
                            if (key === 'Enter') {
                                persist()
                            }
                        }}
                    />
                </div>
                <div>
                    <Label>Display name for link</Label>
                    <Input
                        disabled={busy}
                        type="text"
                        placeholder="Add a display name"
                        value={termsName}
                        onChange={(e) => {
                            update(({ termsOfUse }) => {
                                termsOfUse.termsName = e.target.value
                            })
                        }}
                        onKeyDown={({ key }) => {
                            if (key === 'Enter') {
                                persist()
                            }
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
        flex-shrink: 0;
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
