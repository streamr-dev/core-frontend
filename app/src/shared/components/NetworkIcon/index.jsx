import React from 'react'
import styled from 'styled-components'

import ethereumIcon from './assets/ethereum.svg'
import xDaiIcon from './assets/xdai.svg'
import polygonIcon from './assets/polygon.svg'
import bscIcon from './assets/bsc.svg'
import unknownIcon from './assets/unknown.svg'

const icons = {
    '1': ethereumIcon,
    '100': xDaiIcon,
    '137': polygonIcon,
    '56': bscIcon,
    '8995': ethereumIcon,
    '8997': xDaiIcon,
}

const UnstyledNetworkIcon = ({ chainId, className, emptyIcon, alt = '' }) => (
    <div className={className}>
        <img src={icons[chainId] || emptyIcon || unknownIcon} alt={alt} />
    </div>
)

const NetworkIcon = styled(UnstyledNetworkIcon)`
    img {
        width: 100%;
        display: flex;
        align-items: center;
    }
`

export default NetworkIcon
