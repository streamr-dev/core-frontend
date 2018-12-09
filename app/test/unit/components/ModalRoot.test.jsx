import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

import Context from '$shared/contexts/Modal'
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
    })
})
