// @flow

import React from 'react'

import BrowserNotSupportedPng from '$shared/assets/images/browser_not_supported.png'
import BrowserNotSupportedPng2x from '$shared/assets/images/browser_not_supported@2x.png'
import WalletPng from '$shared/assets/images/wallet.png'
import WalletPng2x from '$shared/assets/images/wallet@2x.png'
import MetamaskPng from '$shared/assets/images/metamask.png'
import MetamaskPng2x from '$shared/assets/images/metamask@2x.png'
import WalletIconPng from '$shared/assets/images/wallet_error.png'
import WalletIconPng2x from '$shared/assets/images/wallet_error@2x.png'
import TxFailedPng2x from '$shared/assets/images/tx_failed@2x.png'
import TxFailedPng from '$shared/assets/images/tx_failed.png'
import ImageUploadPng from '$shared/assets/images/imgupload.png'
import ImageUploadPng2x from '$shared/assets/images/imgupload@2x.png'

const sources = {
    wallet: (
        <img
            src={WalletPng}
            srcSet={`${WalletPng2x} 2x`}
            alt=""
        />
    ),
    walletError: (
        <img
            src={WalletIconPng}
            srcSet={`${WalletIconPng2x} 2x`}
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
    metamask: (
        <img
            src={MetamaskPng}
            srcSet={`${MetamaskPng2x} 2x`}
            alt=""
        />
    ),
    txFailed: (
        <img
            src={TxFailedPng}
            srcSet={`${TxFailedPng2x} 2x`}
            alt=""
        />
    ),
    imageUpload: (
        <img
            src={ImageUploadPng}
            srcSet={`${ImageUploadPng2x} 2x`}
            alt=""
        />
    ),
}

export type PngIconName = $Keys<typeof sources>

type Props = {
    name: PngIconName,
}

const PngIcon = ({ name, ...props }: Props) => React.cloneElement(sources[name], {
    ...props,
})

PngIcon.names = Object.keys(sources).sort()

export default PngIcon
