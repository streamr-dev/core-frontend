import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import { ShareDialogContent, mapDispatchToProps } from '../../../../components/ShareDialog/ShareDialogContent'

describe('ShareDialogContent', () => {
    describe('render', () => {
        let content
        const onClose = () => {}
        beforeEach(() => {
            content = shallow(<ShareDialogContent
                resourceType="testType"
                resourceId="testId"
                getResourcePermissions={() => {}}
                onClose={onClose}
            />)
        })
        it('should contain ShareDialogAnonymousAccessRow', () => {
            const ownerRow = content.find('Connect(ShareDialogAnonymousAccessRow)')
            assert.deepStrictEqual(ownerRow.props(), {
                resourceType: 'testType',
                resourceId: 'testId',
            })
        })
        it('should contain ShareDialogPermissionRow', () => {
            const ownerRow = content.find('Connect(ShareDialogPermissionRow)')
            assert.deepStrictEqual(ownerRow.props(), {
                resourceType: 'testType',
                resourceId: 'testId',
            })
        })
        it('should contain ShareDialogInputRow', () => {
            const ownerRow = content.find('ShareDialogInputRow')
            assert.deepStrictEqual(typeof ownerRow.props().onAdd, 'function')
        })
    })

    describe('mapDispatchToProps', () => {
        it('should return right kind of object with right kind of attrs', () => {
            assert.equal(typeof mapDispatchToProps(), 'object')
        })
    })
})
