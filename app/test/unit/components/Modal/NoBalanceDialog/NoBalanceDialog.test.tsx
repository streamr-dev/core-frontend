import React from 'react'
import BN from 'bignumber.js'
import { render } from '@testing-library/react'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'

describe('NoBalanceDialog', () => {
    describe('render', () => {
        it('must render GetCryptoDialog when ETH balance is zero', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(0),
                        }}
                        balances={{
                            native: new BN(0),
                            data: new BN(0),
                        }}
                        paymentCurrency="DATA"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('get-crypto-dialog')).toBeTruthy()
        })
        it('must render GetCryptoDialog when the Payment currency is DATA and when ETH balance is not enough for transaction gas', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(2),
                        }}
                        balances={{
                            native: new BN(1),
                        }}
                        paymentCurrency="DATA"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('get-crypto-dialog')).toBeTruthy()
        })
        it('must render GetDataTokensDialog when the Payment currency is DATA and the DATA balance is zero', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(0),
                            data: new BN(1),
                        }}
                        balances={{
                            native: new BN(1),
                            data: new BN(0),
                        }}
                        paymentCurrency="DATA"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('get-data-tokens-dialog')).toBeTruthy()
        })
        it('must render InsufficientData when the Payment currency is DATA and the DATA balance is not enough', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(0),
                            data: new BN(3),
                        }}
                        balances={{
                            native: new BN(1),
                            data: new BN(2),
                        }}
                        paymentCurrency="DATA"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('insufficient-data-dialog')).toBeTruthy()
        })
        // eslint-disable-next-line max-len
        it('must render InsufficientDaiDialog when the Payment currency is DAI and the DAI balance is zero while the user has enough ETH for gas', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(1),
                            dai: new BN(2),
                        }}
                        balances={{
                            native: new BN(2),
                            dai: new BN(0),
                        }}
                        paymentCurrency="DAI"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('insufficient-dai-dialog')).toBeTruthy()
        })
        // eslint-disable-next-line max-len
        it('must render InsufficientDaiDialog when the Payment currency is DAI and the DAI balance is not enough while the user has enough ETH for gas', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(1),
                            dai: new BN(10),
                        }}
                        balances={{
                            native: new BN(2),
                            dai: new BN(5),
                        }}
                        paymentCurrency="DAI"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('insufficient-dai-dialog')).toBeTruthy()
        })
        it('must render InsufficientEthDialog when the Payment currency is ETH and ETH balance is not enough', async () => {
            const result = render(
                <>
                    <NoBalanceDialog
                        required={{
                            gas: new BN(1),
                            native: new BN(5),
                        }}
                        balances={{
                            native: new BN(2),
                        }}
                        paymentCurrency="ETH"
                        onCancel={() => null}
                    />
                    <div id={'modal-root'} />
                </>,
            )
            expect(result.queryByTestId('insufficient-token-dialog')).toBeTruthy()
        })
    })
})
