import React from 'react'
import styled from 'styled-components'

import ethereumIcon from './assets/ethereum.svg'
import xDaiIcon from './assets/xdai.svg'
import polygonIcon from './assets/polygon.svg'
import bscIcon from './assets/bsc.svg'
import unknownIcon from './assets/unknown.svg'

const MAINNET_CHAIN_ID = 1
const XDAI_CHAIN_ID = 100
const POLYGON_CHAIN_ID = 137
const BSC_CHAIN_ID = 56

const icons = {
    [MAINNET_CHAIN_ID]: ethereumIcon,
    [XDAI_CHAIN_ID]: xDaiIcon,
    [POLYGON_CHAIN_ID]: polygonIcon,
    [BSC_CHAIN_ID]: bscIcon,
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
