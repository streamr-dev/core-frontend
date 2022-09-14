// @flow

import React from 'react'
import styled from 'styled-components'
import { useImage } from 'react-image'

import { getTokenLogoUrl } from '$shared/utils/tokenAssets'
import unknownTokenSvg from '$shared/assets/images/unknownToken.svg'

type Props = {
    contractAddress?: string,
    chainId: number,
}

const Image = styled.img`
    width: 24px;
    height: 24px;
`

const TokenLogo = ({ contractAddress, chainId, ...props }: Props) => {
    const logoUrl = contractAddress ? getTokenLogoUrl(contractAddress, chainId) : ''
    const { src: imgSrc } = useImage({
        useSuspense: false,
        srcList: [
            logoUrl,
            unknownTokenSvg,
        ],
    })

    return (
        <Image
            {...props}
            src={imgSrc}
            alt="Token logo"
        />
    )
}

export default styled(TokenLogo)``
