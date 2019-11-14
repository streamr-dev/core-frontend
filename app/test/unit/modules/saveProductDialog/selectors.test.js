import assert from 'assert-diff'

import * as all from '$mp/modules/deprecated/saveProductDialog/selectors'
import { saveProductSteps } from '$mp/utils/constants'

const state = {
    test: true,
    saveProductDialog: {
        step: saveProductSteps.TRANSACTION,
        updateFinished: true,
    },
}

describe('saveProductDialog - selectors', () => {
    it('selects dialog step', () => {
        assert.deepStrictEqual(all.selectStep(state), state.saveProductDialog.step)
    })

    it('selects updateFinished', () => {
        assert.deepStrictEqual(all.selectUpdateFinished(state), state.saveProductDialog.updateFinished)
    })
})
