import React from 'react'
import styled from 'styled-components'
import { useImage } from 'react-image'
import { getTokenLogoUrl } from '$shared/utils/tokenAssets'
import GenericTokenLogo from './GenericTokenLogo'

type Props = {
    contractAddress?: string,
    symbol?: string,
    chainId: number,
}
const Image = styled.img`
    width: 24px;
    height: 24px;
`

const UnstyledTokenLogo = ({ contractAddress, symbol, chainId, ...props }: Props) => {
    const logoUrl = contractAddress ? getTokenLogoUrl(contractAddress, chainId) : ''
    const { src: imgSrc } = useImage({
        useSuspense: false,
        srcList: [
            logoUrl,
        ],
    })

    return (
        (imgSrc ? (
            <Image
                {...props}
                src={imgSrc}
                alt="Token logo"
            />
        ) : (
            <GenericTokenLogo
                contractAddress={contractAddress}
                symbol={symbol}
            />
        ))

    )
}

const TokenLogo = styled(UnstyledTokenLogo)``

export default TokenLogo
