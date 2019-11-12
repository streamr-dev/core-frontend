// @flow

import React from 'react'

import BrowserNotSupportedPng from '$shared/assets/images/browser_not_supported.png'
import BrowserNotSupportedPng2x from '$shared/assets/images/browser_not_supported@2x.png'
import DiscardChangesPng from '$shared/assets/images/discard_changes.png'
import DiscardChangesPng2x from '$shared/assets/images/discard_changes@2x.png'
import MetamaskPng from '$shared/assets/images/metamask.png'
import MetamaskPng2x from '$shared/assets/images/metamask@2x.png'
import PublishFailedPng2x from '$shared/assets/images/publish_failed@2x.png'
import PublishFailedPng from '$shared/assets/images/publish_failed.png'
import ImageUploadPng from '$shared/assets/images/imgupload.png'
import ImageUploadPng2x from '$shared/assets/images/imgupload@2x.png'
import WalletPng from '$shared/assets/images/wallet.png'
import WalletPng2x from '$shared/assets/images/wallet@2x.png'
import WalletNoDataPng from '$shared/assets/images/wallet_no_data.png'
import WalletNoDataPng2x from '$shared/assets/images/wallet_no_data@2x.png'
import WalletNoEthPng from '$shared/assets/images/wallet_no_eth.png'
import WalletNoEthPng2x from '$shared/assets/images/wallet_no_eth@2x.png'
import WalletErrorPng from '$shared/assets/images/wallet_error.png'
import WalletErrorPng2x from '$shared/assets/images/wallet_error@2x.png'

const sources = {
    browserNotSupported: (
        <img
            src={BrowserNotSupportedPng}
            srcSet={`${BrowserNotSupportedPng2x} 2x`}
            alt=""
        />
    ),
    discardChanges: (
        <img
            src={DiscardChangesPng}
            srcSet={`${DiscardChangesPng2x} 2x`}
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
    metamask: (
        <img
            src={MetamaskPng}
            srcSet={`${MetamaskPng2x} 2x`}
            alt=""
        />
    ),
    publishFailed: (
        <img
            src={PublishFailedPng}
            srcSet={`${PublishFailedPng2x} 2x`}
            alt=""
        />
    ),
    wallet: (
        <img
            src={WalletPng}
            srcSet={`${WalletPng2x} 2x`}
            alt=""
        />
    ),
    walletNoData: (
        <img
            src={WalletNoDataPng}
            srcSet={`${WalletNoDataPng2x} 2x`}
            alt=""
        />
    ),
    walletNoEth: (
        <img
            src={WalletNoEthPng}
            srcSet={`${WalletNoEthPng2x} 2x`}
            alt=""
        />
    ),
    walletError: (
        <img
            src={WalletErrorPng}
            srcSet={`${WalletErrorPng2x} 2x`}
            alt=""
        />
    ),
    txFailed: (
        <img
            src={WalletErrorPng}
            srcSet={`${WalletErrorPng2x} 2x`}
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
