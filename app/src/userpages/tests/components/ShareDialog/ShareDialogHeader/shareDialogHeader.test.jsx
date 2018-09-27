import React from 'react'
import { shallow, mount } from 'enzyme'
import assert from 'assert-diff'

import ShareDialogHeader from '../../../../components/ShareDialog/ShareDialogHeader'

describe('ShareDialogHeader', () => {
    let header
    describe('render', () => {
        it('is ModalHeader', () => {
            header = shallow(<ShareDialogHeader resourceTitle="" />)
            assert(header.is('ModalHeader'))
        })
        it('renders with correct text', () => {
            header = mount(<ShareDialogHeader resourceTitle="test" />)
            assert.equal(header.find('ModalHeader').text(), 'Share test')
        })
    })
})
