import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { SM, MONO, MEDIUM } from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import Button from '$shared/components/Button'
import Spinner from '$shared/components/Spinner'
import { useValidationErrorSetter, useValidationError } from '$shared/components/ValidationErrorProvider'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Select from '$ui/Select'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import useStreamId from '$shared/hooks/useStreamId'
import useCopy from '$shared/hooks/useCopy'
import Notification from '$shared/utils/Notification'
import ValidationError from '$shared/errors/ValidationError'
import { NotificationIcon } from '$shared/utils/constants'
import { truncate } from '$shared/utils/text'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import useStreamModifier from '$shared/hooks/useStreamModifier'
import { useAuthController } from "$auth/hooks/useAuthController"
import useStreamOwnerOptions, { ADD_ENS_DOMAIN_VALUE } from './useStreamOwnerOptions'

export const ENS_DOMAINS_URL = 'https://ens.domains'

export function ReadonlyStreamId({ className }) {
    const streamId = useStreamId()
    const { copy, isCopied } = useCopy(() => {
        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    })
    return (
        <StreamId className={className}>
            <Pathname>
                <Label>Stream ID</Label>
                <PathnameField>
                    <Text readOnly defaultValue={streamId} disabled />
                </PathnameField>
            </Pathname>
            <div>
                <Label />
                <Button kind="secondary" onClick={() => void copy(streamId)} type="button">
                    {!isCopied && 'Copy'}
                    {!!isCopied && 'Copied!'}
                </Button>
            </div>
        </StreamId>
    )
}

export function EditableStreamId({ className, disabled }) {
    const ownerGroups = useStreamOwnerOptions()
    const owners = useMemo(() => {
        const result = []

        if (ownerGroups) {
            ownerGroups.forEach(({ options }) => {
                result.push(...options)
            })
        }

        return result
    }, [ownerGroups])
    const isOwnersLoading = typeof owners === 'undefined'
    const { busy, clean } = useStreamModifierStatusContext()
    const {currentAuthSession} = useAuthController()
    const [domain, setDomain] = useState<string>()

    useEffect(() => {
        if (!domain) {
            setDomain(currentAuthSession.address.toLowerCase())
        }
    }, [currentAuthSession.address, domain])
    const [pathname = '', setPathname] = useState<string>()
    const { stage } = useStreamModifier()
    const stageRef = useRef(stage)
    useEffect(() => {
        stageRef.current = stage
    }, [stage])
    const setValidationError = useValidationErrorSetter()
    const setValidationErrorRef = useRef(setValidationError)
    useEffect(() => {
        setValidationErrorRef.current = setValidationError
    }, [setValidationError])
    const { id: validationError } = useValidationError()
    useEffect(() => {
        const id = `${domain}/${pathname}`

        if (typeof stageRef.current === 'function') {
            stageRef.current({
                id: undefined,
            })
        }

        if (typeof setValidationErrorRef.current === 'function') {
            setValidationErrorRef.current({
                id: undefined,
            })
        }

        if (!domain || /^\s*$/.test(pathname)) {
            return
        }

        try {
            if (/^\//.test(pathname)) {
                throw new ValidationError('cannot start with a slash')
            }

            if (/\/{2,}/.test(pathname)) {
                throw new ValidationError('cannot contain consecutive "/" characters')
            }

            if (/[^\w]$/.test(pathname)) {
                throw new ValidationError('must end with an alpha-numeric character')
            }

            if (/[^\w.\-/_]/.test(pathname)) {
                throw new ValidationError('may only contain alpha-numeric characters, underscores, and dashes')
            }

            if (typeof stageRef.current === 'function') {
                stageRef.current({
                    id,
                })
            }
        } catch (e) {
            if (e instanceof ValidationError) {
                if (typeof setValidationErrorRef.current === 'function') {
                    setValidationErrorRef.current({
                        id: e.message,
                    })
                }

                return
            }

            throw e
        }
    }, [domain, pathname])
    return (
        <StreamId className={className}>
            <Domain>
                <Label>Domain</Label>
                {disabled || isOwnersLoading ? (
                    <DisabledDomain>
                        {isOwnersLoading ? (
                            <React.Fragment>
                                <span>Loading domains</span>
                                <Spinner size="small" color="blue" />
                            </React.Fragment>
                        ) : (
                            <span>{truncate(domain)}</span>
                        )}
                    </DisabledDomain>
                ) : (
                    <Select
                        options={ownerGroups}
                        value={owners.find(({ value }) => value.toLowerCase() === domain)}
                        onChange={({ value }) => {
                            if (value === ADD_ENS_DOMAIN_VALUE) {
                                window.open(ENS_DOMAINS_URL, '_blank', 'noopener noreferrer')
                                return
                            }

                            setDomain(value)
                        }}
                        disabled={disabled}
                        name="domain"
                    />
                )}
            </Domain>
            <div>
                <Label />
                <Separator />
            </div>
            <Pathname>
                <LabelWrap>
                    <Label>Path name</Label>
                    <Hint>
                        <SvgIcon name="outlineQuestionMark" />
                        <Tooltip>
                            <p>Stream paths can be single or multi-level.</p>
                            <p>Single</p>
                            <pre>streamr.eth/coffeemachine</pre>
                            <p>Multi</p>
                            <pre>oxd93...52874/oracles/price</pre>
                            <p>
                                For more information, see the <a href="https://docs.streamr.network/">docs</a>.
                            </p>
                        </Tooltip>
                    </Hint>
                </LabelWrap>
                <PathnameField>
                    <Text
                        disabled={disabled}
                        invalid={!!validationError}
                        onChange={({ target }) => void setPathname(target.value)}
                        placeholder="Enter a unique stream path name"
                        value={pathname}
                    />
                    {pathname && !disabled && (
                        <ClearButton type="button" onClick={() => void setPathname('')}>
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
const LabelWrap = styled.div`
    display: flex;
`
const Hint = styled.div`
    color: #cdcdcd;
    position: relative;
    transition: 200ms color;

    :hover {
        color: #323232;
    }

    svg {
        display: block;
        left: -2px;
        position: relative;
        top: -2px;
        width: 16px;
    }
`
const Tooltip = styled.div`
    background: #323232;
    border-radius: 4px;
    color: #ffffff;
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.5rem 0.75rem;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 20px;
    transform: translateY(4px);
    transition: 200ms;
    transition-property: visibility, opacity, transform;
    transition-delay: 200ms, 0s, 0s;
    visibility: hidden;
    width: 250px;
    z-index: 1;

    pre {
        color: inherit;
        font-family: ${MONO};
        font-size: 0.9em;
        font-weight: ${MEDIUM};
        margin: 0;
        padding: 0;
    }

    pre,
    p {
        margin: 0;
    }

    pre + p,
    p + p {
        margin-top: 0.75em;
    }

    a {
        color: inherit !important;
        text-decoration: none;
    }

    a:focus,
    a:hover {
        text-decoration: underline;
    }

    ${Hint}:hover & {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0s;
        transition-duration: 50ms;
        visibility: visible;
    }
`
const PathnameField = styled.div`
    position: relative;
`
const LockIcon = styled.div`
    color: #989898;
    height: 40px;
    line-height: 12px;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;

    svg {
        display: block;
        height: 12px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateY(-1px);
        width: 12px;
    }
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
