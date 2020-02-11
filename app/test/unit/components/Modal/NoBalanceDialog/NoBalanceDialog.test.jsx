import React from 'react'
import assert from 'assert-diff'
import { shallow } from 'enzyme'
import BN from 'bignumber.js'

import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import GetDataTokensDialog from '$mp/components/Modal/GetDataTokensDialog'
import InsufficientDataDialog from '$mp/components/Modal/InsufficientDataDialog'
import InsufficientDaiDialog from '$mp/components/Modal/InsufficientDaiDialog'
import InsufficientEthDialog from '$mp/components/Modal/InsufficientEthDialog'

describe('NoBalanceDialog', () => {
    describe('render', () => {
        it('must render GetCryptoDialog when ETH balance is zero', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(0)}
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(0)}
                requiredDataBalance={BN(0)}
                currentDataBalance={BN(0)}
                currentDaiBalance={BN(0)}
                requiredDaiBalance={BN(0)}
                paymentCurrency="DATA"
                onCancel={() => null}
            />)
            assert(wrapper.is(GetCryptoDialog))
        })

        it('must render GetCryptoDialog when the Payment currency is DATA and when ETH balance is not enough for transaction gas', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(2)}
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(1)}
                requiredDataBalance={BN(0)}
                currentDataBalance={BN(0)}
                currentDaiBalance={BN(0)}
                requiredDaiBalance={BN(0)}
                paymentCurrency="DATA"
                onCancel={() => null}
            />)
            assert(wrapper.is(GetCryptoDialog))
        })

        it('must render GetDataTokensDialog when the Payment currency is DATA and the DATA balance is zero', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(0)}
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(1)}
                requiredDataBalance={BN(1)}
                currentDataBalance={BN(0)}
                currentDaiBalance={BN(0)}
                requiredDaiBalance={BN(0)}
                paymentCurrency="DATA"
                onCancel={() => null}
            />)
            assert(wrapper.is(GetDataTokensDialog))
        })

        it('must render InsufficientData when the Payment currency is DATA and the DATA balance is not enough', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(0)}
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(1)}
                requiredDataBalance={BN(3)}
                currentDataBalance={BN(2)}
                currentDaiBalance={BN(0)}
                requiredDaiBalance={BN(0)}
                paymentCurrency="DATA"
                onCancel={() => null}
            />)
            assert(wrapper.is(InsufficientDataDialog))
        })

        it('must render InsufficientDaiDialog when the Payment currency is DAI and the DAI balance is zero while the user has enough ETH for gas', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(1)}
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(2)}
                requiredDataBalance={BN(1)}
                currentDataBalance={BN(0)}
                currentDaiBalance={BN(0)}
                requiredDaiBalance={BN(2)}
                paymentCurrency="DAI"
                onCancel={() => null}
            />)
            assert(wrapper.is(InsufficientDaiDialog))
        })

        it('must render InsufficientDaiDialog when the Payment currency is DAI and the DAI balance is not enough while the user has enough ETH for gas', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(1)}
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(2)}
                requiredDataBalance={BN(3)}
                currentDataBalance={BN(2)}
                currentDaiBalance={BN(5)}
                requiredDaiBalance={BN(10)}
                paymentCurrency="DAI"
                onCancel={() => null}
            />)
            assert(wrapper.is(InsufficientDaiDialog))
        })

        it('must render InsufficientEthDialog when the Payment currency is ETH and ETH balance is not enough', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredGasBalance={BN(1)}
                requiredEthBalance={BN(5)}
                currentEthBalance={BN(2)}
                requiredDataBalance={BN(1)}
                currentDataBalance={BN(0)}
                currentDaiBalance={BN(0)}
                requiredDaiBalance={BN(2)}
                paymentCurrency="ETH"
                onCancel={() => null}
            />)
            assert(wrapper.is(InsufficientEthDialog))
        })
    })
})
