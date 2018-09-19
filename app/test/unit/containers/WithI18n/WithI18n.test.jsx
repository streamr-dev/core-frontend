import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { withI18n } from '../../../../src/marketplace/containers/WithI18n'
import mockStore from '../../../test-utils/mockStoreProvider'

/* eslint-disable */
class EmptyComponent extends React.Component {
    render() {
        return (
            <div>
            </div>
        )
    }
}
/* eslint-enable */

describe('WithI18n', () => {
    let wrapper
    let props
    let sandbox
    let store

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        store = {
            i18n: {
                locale: 'en',
            },
        }
        props = {
            store: mockStore(store),
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        const EmptyWithHOC = withI18n(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)
        expect(wrapper.dive().find(EmptyComponent).length).toEqual(1)
    })

    it('augments the target component with right props', () => {
        const EmptyWithHOC = withI18n(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)

        const innerComponent = wrapper.dive()
        expect(innerComponent.find(EmptyComponent).length).toEqual(1)
        expect(innerComponent.prop('locale')).toEqual('en')
        expect(innerComponent.prop('translate')).toEqual(expect.any(Function))
    })
})
