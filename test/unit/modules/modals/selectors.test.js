import assert from 'assert-diff'

import * as all from '../../../../src/modules/modals/selectors'

const state = {
    test: true,
    modals: {
        modalName: 'TEST_MODAL',
        modalProps: {
            id: 89,
            name: 'Test parameter',
        },
    },
    otherData: 42,
}

describe('modals - selectors', () => {
    it('selects modal name', () => {
        assert.equal(all.selectModalName(state), 'TEST_MODAL')
    })

    it('selects modal props', () => {
        assert.equal(all.selectModalProps(state), state.modals.modalProps)
    })

    it('selects modal isopen', () => {
        assert.equal(all.selectIsModalOpen(state), true)
    })
})
