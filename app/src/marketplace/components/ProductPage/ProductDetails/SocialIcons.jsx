// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import { type ContactDetails } from '$mp/flowtype/product-types'

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-items: center;
`

const IconContainer = styled.div`
    display: grid;
    justify-items: center;
    align-items: center;
    grid-auto-columns: 24px;
    grid-gap: 40px;
    grid-auto-flow: column;
`

const Icon = styled(SvgIcon)`
    width: 24px;
    height: 24px;
    color: #979797;
`

type Props = {
    className?: string,
    contactDetails: ContactDetails,
}

const getIconForUrl = (socialUrl: ?string) => {
    if (socialUrl == null) {
        return null
    }

    const url = socialUrl.trim().toLowerCase()

    if (url.includes('github.com')) {
        return 'github'
    } else if (url.includes('medium.com')) {
        return 'medium'
    } else if (url.includes('peepeth.com')) {
        return 'peepeth'
    } else if (url.includes('reddit.com')) {
        return 'reddit'
    } else if (url.includes('t.me')) {
        return 'telegram'
    } else if (url.includes('trello.com')) {
        return 'trello'
    } else if (url.includes('twitter.com')) {
        return 'twitter'
    } else if (url.includes('youtube.com')) {
        return 'youtube'
    } else if (url.includes('linkedin.com')) {
        return 'linkedin'
    }
    return null
}

const renderIcon = (name: ?string, url: ?string) => (
    name && url && (
        <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
        >
            <Icon name={name} />
        </a>
    )
)

const SocialIcons = ({ className, contactDetails }: Props) => {
    const useMemoSocial = (name: string) => {
        const property = contactDetails[name]
        return useMemo(() => ({
            iconName: getIconForUrl(property),
            url: property,
        }), [property])
    }

    const social1 = useMemoSocial('social1')
    const social2 = useMemoSocial('social2')
    const social3 = useMemoSocial('social3')
    const social4 = useMemoSocial('social4')

    return (
        <Container className={className}>
            <IconContainer>
                {renderIcon(social1.iconName, social1.url)}
                {renderIcon(social2.iconName, social2.url)}
                {renderIcon(social3.iconName, social3.url)}
                {renderIcon(social4.iconName, social4.url)}
            </IconContainer>
        </Container>
    )
}

export default SocialIcons
