import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { withI18n } from '$shared/containers/WithI18n'
import mockStore from '$testUtils/mockStoreProvider'

/* eslint-disable react/prefer-stateless-function */
class EmptyComponent extends React.Component {
    render() {
        return <div />
    }
}
/* eslint-enable react/prefer-stateless-function */

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
        expect(wrapper.dive().dive().find(EmptyComponent).length).toEqual(1)
    })

    it('augments the target component with right props', () => {
        const EmptyWithHOC = withI18n(EmptyComponent)
        wrapper = shallow(<EmptyWithHOC {...props} />)

        const innerComponent = wrapper.dive().dive()
        expect(innerComponent.find(EmptyComponent).length).toEqual(1)
        expect(innerComponent.prop('locale')).toEqual('en')
    })
})
