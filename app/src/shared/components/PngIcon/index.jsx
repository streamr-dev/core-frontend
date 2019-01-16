// @flow

import React from 'react'

import BrowserNotSupportedPng from '$shared/assets/images/browser_not_supported.png'
import BrowserNotSupportedPng2x from '$shared/assets/images/browser_not_supported@2x.png'
import WalletPng from '$shared/assets/images/wallet.png'
import WalletPng2x from '$shared/assets/images/wallet@2x.png'

const sources = {
    wallet: (
        <img
            src={WalletPng}
            srcSet={`${WalletPng2x} 2x`}
            alt=""
        />
    ),
    browserNotSupported: (
        <img
            src={BrowserNotSupportedPng}
            srcSet={`${BrowserNotSupportedPng2x} 2x`}
            alt=""
        />
    ),
}

type Props = {
    name: $Keys<typeof sources>,
}

const PngIcon = ({ name, ...props }: Props) => React.cloneElement(sources[name], {
    ...props,
})

PngIcon.names = Object.keys(sources).sort()

export default PngIcon
