import React from 'react'
import assert from 'assert-diff'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { ChooseAccessPeriodDialog } from '$mp/components/deprecated/ChooseAccessPeriodDialog'
import { currencies, timeUnits } from '$shared/utils/constants'

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
            const wrapper = shallow(<ChooseAccessPeriodDialog
                contractProduct={{
                    pricePerSecond: 100,
                    priceCurrency: currencies.DATA,
                }}
                dataPerUsd={0.5}
                translate={() => {}}
            />)
            wrapper.setState({
                time: '3',
                timeUnit: timeUnits.day,
            })
            const label = wrapper.find('.priceLabels')
            const DATA = 25920000
            const USD = 51840000
            assert.equal(label.text(), `${DATA}DATA$${USD}USD`)
        })
    })
})
