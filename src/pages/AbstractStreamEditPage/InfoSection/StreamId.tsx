import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { z } from 'zod'
import { Button } from '~/components/Button'
import { Hint } from '~/components/Hint'
import Spinner from '~/components/Spinner'
import { PathnameSchema } from '~/parsers/StreamParser'
import SvgIcon from '~/shared/components/SvgIcon'
import Errors, { MarketplaceTheme } from '~/shared/components/Ui/Errors'
import Label from '~/shared/components/Ui/Label'
import Select from '~/shared/components/Ui/Select'
import Text from '~/shared/components/Ui/Text'
import useCopy from '~/shared/hooks/useCopy'
import { useWalletAccount } from '~/shared/stores/wallet'
import { PHONE } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { StreamDraft } from '~/stores/streamDraft'
import useStreamOwnerOptionGroups, {
    ADD_ENS_DOMAIN_VALUE,
    OptionGroup,
} from './useStreamOwnerOptionGroups'

export const ENS_DOMAINS_URL = 'https://ens.domains'

export function ReadonlyStreamId({ streamId }: { streamId: string }) {
    const { copy, isCopied } = useCopy()

    return (
        <StreamId>
            <Pathname>
                <Label>Stream ID</Label>
                <PathnameField>
                    <Text readOnly value={streamId} disabled />
                </PathnameField>
            </Pathname>
            <div>
                <Label>&zwnj;</Label>
                <Button
                    kind="secondary"
                    onClick={() =>
                        void copy(streamId || '', {
                            toastMessage: 'Stream ID copied',
                        })
                    }
                    type="button"
                >
                    {isCopied ? 'Copied!' : 'Copy'}
                </Button>
            </div>
        </StreamId>
    )
}

interface EditableStreamIdProps {
    disabled?: boolean
}

export function EditableStreamId({ disabled = false }: EditableStreamIdProps) {
    const { domain = '', pathname = '' } = StreamDraft.useEntity({ hot: true }) || {}

    const ownerGroups = useStreamOwnerOptionGroups(domain)

    const update = StreamDraft.useUpdateEntity()

    const [{ pathname: validationError }, setErrors] = useState<
        Record<string, string | undefined>
    >({})

    const validate = StreamDraft.useValidateEntity((entity) => {
        z.object({
            pathname: PathnameSchema,
        }).parse(entity)
    })

    const owners = useMemo(() => {
        const result: OptionGroup['options'] = []

        if (ownerGroups) {
            ownerGroups.forEach(({ options }) => {
                result.push(...options)
            })
        }

        return result
    }, [ownerGroups])

    const isOwnersLoading = typeof ownerGroups === 'undefined'

    const account = useWalletAccount()

    useEffect(
        function setCurrentAccountAsDomain() {
            /**
             * We may wanna skip this step of delay it while we're doing
             * something to the stream, e.g. transacting or block-awaiting.
             */

            /**
             * We set the domain for both hot and cold copies of the entity
             * here so that *just* changing the account does not cause the state
             * to be dirty. All we care about is, after all, the pathname.
             */

            update((hot, cold) => {
                if (!hot.domain) {
                    hot.domain = account || ''
                }

                cold.domain = hot.domain
            })
        },
        [update, account],
    )

    return (
        <StreamId>
            <Domain>
                <Label>
                    <LabelInner>Domain</LabelInner>
                </Label>
                {disabled || isOwnersLoading || !account ? (
                    <DisabledDomain>
                        {isOwnersLoading ? (
                            <>
                                <span>Loading domains…</span>
                                {!disabled && <Spinner color="blue" />}
                            </>
                        ) : (
                            <span>{truncate(domain || account || 'No account')}</span>
                        )}
                    </DisabledDomain>
                ) : (
                    <Select
                        options={ownerGroups}
                        value={owners.find(
                            ({ value }) => value.toLowerCase() === (domain || account),
                        )}
                        onChange={(option) => {
                            const { value = '' } = option || {}

                            if (value === ADD_ENS_DOMAIN_VALUE) {
                                window.open(
                                    ENS_DOMAINS_URL,
                                    '_blank',
                                    'noopener noreferrer',
                                )
                                return
                            }

                            /**
                             * We set the domain for both hot and cold copies of the entity
                             * here so that *just* changing the account does not cause the state
                             * to be dirty. All we care about is, after all, the pathname.
                             */

                            update((hot, cold) => {
                                hot.domain = value

                                cold.domain = value
                            })
                        }}
                        disabled={disabled}
                        name="domain"
                    />
                )}
            </Domain>
            <div>
                <Label>
                    <LabelInner />
                </Label>
                <Separator />
            </div>
            <Pathname>
                <Label>
                    <LabelInner>
                        <span>Path name</span>
                        <Hint>
                            <p>Stream paths can be single or multi-level.</p>
                            <p>Single</p>
                            <pre>streamr.eth/coffeemachine</pre>
                            <p>Multi</p>
                            <pre>streamr.eth/oracles/price</pre>
                            <p>
                                For more information, see the{' '}
                                <a href="https://docs.streamr.network/">docs</a>.
                            </p>
                        </Hint>
                    </LabelInner>
                </Label>
                <PathnameField>
                    <Text
                        disabled={disabled}
                        invalid={!!validationError}
                        onChange={({ target }) => {
                            update((draft) => {
                                draft.pathname = target.value
                            })

                            setErrors(validate())
                        }}
                        placeholder="Enter a unique stream path name"
                        value={pathname}
                    />
                    {pathname && !disabled && (
                        <ClearButton
                            type="button"
                            onClick={() => {
                                update((draft) => {
                                    draft.pathname = ''
                                })

                                setErrors(validate())
                            }}
                        >
                            <SvgIcon name="clear" />
                        </ClearButton>
                    )}
                </PathnameField>
                {!!validationError && (
                    <Errors overlap theme={MarketplaceTheme}>
                        {validationError}
                    </Errors>
                )}
            </Pathname>
        </StreamId>
    )
}

const Domain = styled.div`
    flex-grow: 1;

    @media ${PHONE} {
        max-width: 222px;
    }
`

const SeparatorAttrs = {
    children: '/',
}

const Separator = styled.div.attrs(SeparatorAttrs)`
    line-height: 40px;
`

const Pathname = styled.div`
    flex-grow: 1;

    ${Label} {
        flex-grow: 1;
    }
`

const PathnameField = styled.div`
    position: relative;
`

const DisabledDomain = styled.div`
    align-items: center;
    background-color: #efefef;
    border-radius: 4px;
    border: 1px solid #efefef;
    color: #525252;
    display: flex;
    font-size: 0.875rem;
    height: 40px;
    padding: 0 1rem;
    width: 100%;

    > span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

const ClearButton = styled.button`
    width: 40px;
    height: 40px;
    color: #989898;
    position: absolute;
    top: 0;
    line-height: 16px;
    right: 0;
    border: 0;
    background: none;
    outline: none;
    appearance: none;

    :focus {
        outline: none;
    }

    svg {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    :hover circle {
        fill: #525252;
        stroke: #525252;
    }
`

const StreamId = styled.div`
    display: flex;

    > * + * {
        margin-left: 16px;
    }
`

const LabelInner = styled.div`
    align-items: center;
    display: flex;
    min-height: 24px;

    span {
        flex-grow: 1;
    }
`
