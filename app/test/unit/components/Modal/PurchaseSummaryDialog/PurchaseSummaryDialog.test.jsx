import React from 'react'
import assert from 'assert-diff'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { Translate } from 'react-redux-i18n'

import { PurchaseSummaryDialog } from '$mp/components/deprecated/PurchaseSummaryDialog'
import { contractCurrencies as currencies, timeUnits } from '$shared/utils/constants'

describe('ChooseAccessPeriodDialog', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    // TODO: rest of the tests

    describe('render', () => {
        it('must calculate the price from contractProduct', () => {
            const wrapper = shallow(<PurchaseSummaryDialog
                product={{
                    name: 'fancy name',
                }}
                contractProduct={{
                    pricePerSecond: 100,
                    priceCurrency: currencies.DATA,
                }}
                dataPerUsd={0.5}
                purchase={{
                    time: '3',
                    timeUnit: timeUnits.day,
                }}
                translate={() => {}}
            />)
            const translate = wrapper.find(Translate).at(1)
            assert.equal(translate.props().price, 25920000)
            assert.equal(translate.props().priceCurrency, currencies.DATA)
        })
    })
})
