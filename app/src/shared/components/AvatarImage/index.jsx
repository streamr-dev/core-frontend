import React, { useMemo } from 'react'
import styled from 'styled-components'

import UnstyledFallbackImage from '$shared/components/FallbackImage'
import { isEthereumAddress } from '$mp/utils/validate'
import SvgIcon from '$shared/components/SvgIcon'

import Initials from './Initials'
import Identicon from './Identicon'

const FallbackImage = styled(UnstyledFallbackImage)`
    display: block;
    height: 100%;
    width: 100%;
`

const UnstyledAvatarImage = ({
    username,
    name,
    src,
    upload = false,
    ...props
}) => {
    const placeholder = useMemo(() => {
        if (isEthereumAddress(username)) {
            return (
                <Identicon id={username} />
            )
        }

        if (name) {
            const initials = (name || '').split(/\s+/).filter(Boolean).map((s) => s[0]).slice(0, 2)
                .join('')
                .toUpperCase()

            if (initials) {
                return (
                    <Initials>
                        {initials}
                    </Initials>
                )
            }
        }

        return (
            <SvgIcon name={upload ? 'emptyAvatarUpload' : 'profileMan'} />
        )
    }, [username, name, upload])

    return (
        <div {...props}>
            <FallbackImage
                alt={name || ''}
                src={src || ''}
                placeholder={placeholder}
            />
        </div>
    )
}

export default styled(UnstyledAvatarImage)``
