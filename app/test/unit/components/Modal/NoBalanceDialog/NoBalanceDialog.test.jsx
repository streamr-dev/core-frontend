import React from 'react'
import assert from 'assert-diff'
import { shallow } from 'enzyme'
import BN from 'bignumber.js'

import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import GetDataTokensDialog from '$mp/components/Modal/GetDataTokensDialog'
import InsufficientDataDialog from '$mp/components/Modal/InsufficientDataDialog'

describe('NoBalanceDialog', () => {
    describe('render', () => {
        it('must render GetCryptoDialog when ETH balance is zero', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredEthBalance={BN(1)}
                currentEthBalance={BN(0)}
                requiredDataBalance={BN(0)}
                currentDataBalance={BN(0)}
                onCancel={() => null}
            />)
            assert(wrapper.is(GetCryptoDialog))
        })

        it('must render GetCryptoDialog when ETH balance is not enough', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredEthBalance={BN(2)}
                currentEthBalance={BN(1)}
                requiredDataBalance={BN(0)}
                currentDataBalance={BN(0)}
                onCancel={() => null}
            />)
            assert(wrapper.is(GetCryptoDialog))
        })

        it('must render GetDataTokensDialog when DATA balance is zero', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(1)}
                requiredDataBalance={BN(1)}
                currentDataBalance={BN(0)}
                onCancel={() => null}
            />)
            assert(wrapper.is(GetDataTokensDialog))
        })

        it('must render InsufficientData when DATA balance is not enough', async () => {
            const wrapper = shallow(<NoBalanceDialog
                requiredEthBalance={BN(0)}
                currentEthBalance={BN(1)}
                requiredDataBalance={BN(3)}
                currentDataBalance={BN(2)}
                onCancel={() => null}
            />)
            assert(wrapper.is(InsufficientDataDialog))
        })
    })
})
