import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import ethereumIcon from './assets/ethereum.svg'
import xDaiIcon from './assets/xdai.svg'
import polygonIcon from './assets/polygon.svg'
import bscIcon from './assets/bsc.svg'
import unknownIcon from './assets/unknown.svg'

const icons: { [key: string]: any } = {
    '1': ethereumIcon,
    '100': xDaiIcon,
    '137': polygonIcon,
    '56': bscIcon,
    '8995': ethereumIcon,
    '8997': xDaiIcon,
    '80002': polygonIcon,
}

type NetworkIconProps = {
    chainId: number
    className?: string
    emptyIcon?: string
    alt?: string
}

const UnstyledNetworkIcon: FunctionComponent<NetworkIconProps> = ({
    chainId,
    className,
    emptyIcon,
    alt = '',
}) => (
    <div className={className}>
        <img src={icons[String(chainId)] || emptyIcon || unknownIcon} alt={alt} />
    </div>
)

const NetworkIcon = styled(UnstyledNetworkIcon)<NetworkIconProps>`
    img {
        width: 100%;
        display: flex;
        align-items: center;
    }
`

export default NetworkIcon
