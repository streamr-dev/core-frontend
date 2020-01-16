import React from 'react'
import assert from 'assert-diff'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import AmountEditor from '$mp/components/Modal/SetPriceDialog/AmountEditor/index'
import { contractCurrencies as currencies } from '$shared/utils/constants'

describe('AmountEditor', () => {
    let sandbox
    let wrapper
    let onChange
    let props

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        onChange = sandbox.spy()

        props = {
            currency: currencies.DATA,
            dataPerUsd: '20',
            onChange,
        }

        wrapper = shallow(<AmountEditor
            {...props}
        />)
    })

    afterEach(() => {
        sandbox.reset()
    })

    it('renders the component', () => {
        expect(wrapper.length).toEqual(1)
    })

    it('synchronises correct USD and DATA input amounts after a DATA input change', () => {
        const dataInput = wrapper.find('.dataInput')

        dataInput.simulate('change', {
            target: {
                value: '10',
            },
        })

        assert.equal(wrapper.find('.dataInput').props().value, '10')
        assert.equal(wrapper.find('.usdInput').props().value, '0.50')
    })

    it('synchronises correct USD and DATA amounts after a USD input change', () => {
        const usdInput = wrapper.find('.usdInput')

        usdInput.simulate('change', {
            target: {
                value: '50',
            },
        })

        assert.equal(wrapper.find('.dataInput').props().value, '1000')
        assert.equal(wrapper.find('.usdInput').props().value, '50')
    })

    it('assigns the correct product amount in DATA when new DATA value is given', () => {
        const dataInput = wrapper.find('.dataInput')

        dataInput.simulate('change', {
            target: {
                value: '10',
            },
        })

        expect(onChange.callCount).toEqual(1)
        expect(onChange.calledWith('10')).toEqual(true)
    })

    it('assigns the correct product amount in DATA when a new USD value is given', () => {
        const usdInput = wrapper.find('.usdInput')

        usdInput.simulate('change', {
            target: {
                value: '50',
            },
        })

        expect(onChange.callCount).toEqual(1)
        expect(onChange.calledWith('1000')).toEqual(true)
    })

    it('assigns the correct product amount in DATA when a new USD value is given', () => {
        const usdInput = wrapper.find('.usdInput')

        usdInput.simulate('change', {
            target: {
                value: '50',
            },
        })

        expect(onChange.callCount).toEqual(1)
        expect(onChange.calledWith('1000')).toEqual(true)
    })

    it('assigns the correct product amount in USD when a new DATA value is given', () => {
        wrapper = shallow(<AmountEditor
            {...props}
            currency={currencies.USD}
        />)

        const dataInput = wrapper.find('.dataInput')

        dataInput.simulate('change', {
            target: {
                value: '10',
            },
        })

        expect(onChange.callCount).toEqual(1)
        expect(onChange.calledWith('0.50')).toEqual(true)
    })

    it('assigns the correct product amount in USD when a new USD value is given', () => {
        wrapper = shallow(<AmountEditor
            {...props}
            currency={currencies.USD}
        />)

        const usdInput = wrapper.find('.usdInput')

        usdInput.simulate('change', {
            target: {
                value: '50',
            },
        })

        expect(onChange.callCount).toEqual(1)
        expect(onChange.calledWith('50')).toEqual(true)
    })
})
