import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isAddress } from 'web3-validator'
import { FallbackImage as UnstyledFallbackImage } from '~/components/FallbackImage'
import SvgIcon from '~/shared/components/SvgIcon'
import Initials from './Initials'
import Identicon from './Identicon'

const FallbackImage = styled(UnstyledFallbackImage)`
    display: block;
    height: 100%;
    width: 100%;
`

const UnstyledAvatarImage = ({ username, name, src, upload = false, ...props }) => {
    const placeholder = useMemo(() => {
        if (isAddress(username)) {
            return <Identicon id={username} />
        }

        if (name) {
            const initials = (name || '')
                .split(/\s+/)
                .filter(Boolean)
                .map((s) => s[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

            if (initials) {
                return <Initials>{initials}</Initials>
            }
        }

        return <SvgIcon name={upload ? 'emptyAvatarUpload' : 'profileMan'} />
    }, [username, name, upload])
    return (
        <div {...props}>
            <FallbackImage alt={name || ''} src={src || ''} placeholder={placeholder} />
        </div>
    )
}

const AvatarImage = styled(UnstyledAvatarImage)``

export default AvatarImage

export const HubAvatar = styled(Identicon)`
    width: 32px;
    height: 32px;
    border: 1px solid #f3f3f3;
    border-radius: 50%;
    background-color: white;
`
export const HubImageAvatar = styled(UnstyledFallbackImage)`
    width: 32px;
    height: 32px;
    border: 1px solid #f3f3f3;
    border-radius: 50%;
    background-color: white;
`
