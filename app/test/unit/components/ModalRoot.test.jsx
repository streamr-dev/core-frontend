/* eslint-disable react/prop-types */

import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

import Context from '$shared/contexts/Modal'
import Modal from '$shared/components/Modal'
import ModalRoot from '$shared/components/ModalRoot'

describe(ModalRoot, () => {
    it('renders #app', () => {
        expect(shallow(<ModalRoot />).find('#app')).toHaveLength(1)
    })

    it('renders children', () => {
        const el = mount((
            <ModalRoot>
                <div className="child" />
                <div className="child" />
            </ModalRoot>
        ))
        expect(el.find('#app .child')).toHaveLength(2)
    })

    it('provides current modal root to context consumers', () => {
        const consume = sinon.spy()
        expect(mount((
            <ModalRoot>
                <Context.Consumer>
                    {consume}
                </Context.Consumer>
            </ModalRoot>
        )))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('root', sinon.match.instanceOf(HTMLDivElement)))
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('isModalOpen', false))
    })

    it('provides a flag indicating that a modal is open', () => {
        const consume = sinon.spy()
        const el = mount((
            <ModalRoot>
                <React.Fragment>
                    <Modal />
                    <Modal />
                </React.Fragment>
            </ModalRoot>
        ))
        expect(el.state('count')).toEqual(2)
        el.setProps({
            children: (
                <React.Fragment>
                    <Modal />
                    <Modal />
                    <Context.Consumer>
                        {consume}
                    </Context.Consumer>
                </React.Fragment>
            ),
        })
        expect(el.state('count')).toEqual(2)
        sinon.assert.alwaysCalledWith(consume, sinon.match.has('isModalOpen', true))
    })

    it('resets the flag indicating that the modal is open when modals are gone', () => {
        const consume = sinon.spy()
        const el = mount((
            <ModalRoot>
                <React.Fragment>
                    <Modal />
                </React.Fragment>
            </ModalRoot>
        ))
        expect(el.state('count')).toEqual(1)
        el.setProps({
            children: (
                <React.Fragment>
                    <Modal />
                    <Context.Consumer>
                        {consume}
                    </Context.Consumer>
                </React.Fragment>
            ),
        })
        expect(el.state('count')).toEqual(1)
        sinon.assert.calledOnce(consume)
        sinon.assert.calledWith(consume.firstCall, sinon.match.has('isModalOpen', true))
        el.setProps({
            children: (
                <React.Fragment>
                    <Context.Consumer>
                        {consume}
                    </Context.Consumer>
                </React.Fragment>
            ),
        })
        expect(el.state('count')).toEqual(0)
        sinon.assert.calledThrice(consume)
        // In the 2nd call the modal is about to be removed!
        sinon.assert.calledWith(consume.secondCall, sinon.match.has('isModalOpen', true))
        // In the 3rd call the modal is gone!
        sinon.assert.calledWith(consume.thirdCall, sinon.match.has('isModalOpen', false))
    })
})
