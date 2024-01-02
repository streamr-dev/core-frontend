import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { SM } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import Button from '~/shared/components/Button'
import Spinner from '~/components/Spinner'
import Label from '~/shared/components/Ui/Label'
import Text from '~/shared/components/Ui/Text'
import Select from '~/shared/components/Ui/Select'
import Errors, { MarketplaceTheme } from '~/shared/components/Ui/Errors'
import useCopy from '~/shared/hooks/useCopy'
import { truncate } from '~/shared/utils/text'
import {
    useCurrentDraftError,
    useSetCurrentDraftError,
    useSetCurrentDraftTransientStreamId,
} from '~/shared/stores/streamEditor'
import { useWalletAccount } from '~/shared/stores/wallet'
import Help from '~/components/Help'
import { DraftValidationError } from '~/errors'
import useStreamOwnerOptionGroups, {
    ADD_ENS_DOMAIN_VALUE,
    OptionGroup,
} from './useStreamOwnerOptionGroups'
import { Hint } from '~/components/Hint'

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
                <Label keepSpace />
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
    const ownerGroups = useStreamOwnerOptionGroups()

    const validationError = useCurrentDraftError('streamId')

    const setTransientStreamId = useSetCurrentDraftTransientStreamId()

    const setValidationError = useSetCurrentDraftError()

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

    const [domain, setDomain] = useState<string>()

    const [pathname, setPathname] = useState('')

    const pathnameRef = useRef(pathname)

    useEffect(() => {
        pathnameRef.current = pathname
    }, [pathname])

    const commitRef = useRef(function commit(
        newDomain: string | undefined,
        newPathname: string,
    ) {
        setTransientStreamId('')

        setValidationError('streamId', '')

        if (!newDomain || newPathname === '') {
            return
        }

        try {
            if (/^\//.test(newPathname)) {
                throw new DraftValidationError('streamId', 'cannot start with a slash')
            }

            if (/\/{2,}/.test(newPathname)) {
                throw new DraftValidationError(
                    'streamId',
                    'cannot contain consecutive "/" characters',
                )
            }

            if (/[^\w]$/.test(newPathname)) {
                throw new DraftValidationError(
                    'streamId',
                    'must end with an alpha-numeric character',
                )
            }

            if (/[^\w.\-/_]/.test(newPathname)) {
                throw new DraftValidationError(
                    'streamId',
                    'may only contain alpha-numeric characters, underscores, and dashes',
                )
            }

            setTransientStreamId(`${newDomain}/${newPathname}`)
        } catch (e) {
            if (e instanceof DraftValidationError) {
                return void setValidationError(e.key, e.message)
            }

            throw e
        }
    })

    useEffect(() => {
        setDomain(undefined)

        commitRef.current(account, pathnameRef.current)
    }, [account])

    return (
        <StreamId>
            <Domain>
                <Label>Domain</Label>
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
                        onChange={({ value }) => {
                            if (value === ADD_ENS_DOMAIN_VALUE) {
                                window.open(
                                    ENS_DOMAINS_URL,
                                    '_blank',
                                    'noopener noreferrer',
                                )
                                return
                            }

                            setDomain(value)

                            commitRef.current(value || account, pathname)
                        }}
                        disabled={disabled}
                        name="domain"
                    />
                )}
            </Domain>
            <div>
                <Label keepSpace />
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
                            setPathname(target.value)

                            commitRef.current(domain || account, target.value)
                        }}
                        placeholder="Enter a unique stream path name"
                        value={pathname}
                    />
                    {pathname && !disabled && (
                        <ClearButton
                            type="button"
                            onClick={() => {
                                setPathname('')

                                commitRef.current(domain || account, '')
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

    @media (min-width: ${SM}px) {
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

    span {
        flex-grow: 1;
    }
`
