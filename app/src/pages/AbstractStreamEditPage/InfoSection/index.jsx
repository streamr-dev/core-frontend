import React, { useCallback } from 'react'
import styled from 'styled-components'
import TOCPage from '$shared/components/TOCPage'
import Text from '$ui/Text'
import useStreamId from '$shared/hooks/useStreamId'
import Label from '$ui/Label'
import Surround from '$shared/components/Surround'
import { Viewer, Creator } from './StreamId'
import { ADD_ENS_DOMAIN_VALUE } from './useStreamOwnerOptions'

const ENS_DOMAINS_URL = 'https://ens.domains'

function DefaultDescription() {
    const streamId = useStreamId()

    return (
        <Description>
            All streams require a unique path in the format <strong>domain/pathname</strong>.
            <Surround head=" " tail=" ">
                Your default domain will be an Ethereum address, but you can also use an existing ENS domain or
            </Surround>
            <Surround tail=".">
                <a href={ENS_DOMAINS_URL} target="_blank" rel="nofollow noopener noreferrer">
                    register a new one
                </a>
            </Surround>
            {!streamId && (
                <Surround head=" ">
                    Choose your stream name &amp; create it in order to adjust stream settings.
                </Surround>
            )}
        </Description>
    )
}

function noop() {}

function UnstyledInfoSection({
    className,
    desc = <DefaultDescription />,
    description = '',
    disabled = false,
    domain,
    hideDescription = false,
    onDescriptionChange = noop,
    onDomainChange: onDomainChangeProp,
    onPathnameChange,
    pathname,
    validationError,
}) {
    const streamId = useStreamId()

    const onDomainChange = useCallback((newDomain) => {
        if (newDomain === ADD_ENS_DOMAIN_VALUE) {
            window.open(ENS_DOMAINS_URL, '_blank', 'noopener noreferrer')
            return
        }

        if (typeof onDomainChangeProp === 'function') {
            onDomainChangeProp(newDomain)
        }
    }, [onDomainChangeProp])

    return (
        <TOCPage.Section
            id="details"
            title="Details"
        >
            <div className={className}>
                {desc}
                <Row>
                    {streamId ? (
                        <Viewer
                            disabled={disabled}
                            streamId={streamId}
                        />
                    ) : (
                        <Creator
                            disabled={disabled}
                            domain={domain}
                            onDomainChange={onDomainChange}
                            onPathnameChange={onPathnameChange}
                            pathname={pathname}
                            validationError={validationError}
                        />
                    )}
                </Row>
                {!hideDescription && (
                    <Row>
                        <Label htmlFor="streamDescription">
                            Description
                        </Label>
                        <Text
                            type="text"
                            id="streamDescription"
                            name="description"
                            placeholder="Add a brief description"
                            value={description}
                            // Move `onChange` to `onBlur`.
                            onChange={({ target }) => void onDescriptionChange(target.value || '')}
                            disabled={disabled}
                            autoComplete="off"
                        />
                    </Row>
                )}
            </div>
        </TOCPage.Section>
    )
}

const Row = styled.div`
    & + & {
        margin-top: 2rem;
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`

const InfoSection = styled(UnstyledInfoSection)`
    input[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }
`

export default InfoSection
