import groups, { DEFAULTS_KEYS } from '../groups'
import { EDIT, GRANT } from '../operations'
import ig from './identifyGroup'

it('identifies empty combination as a default', () => {
    expect(DEFAULTS_KEYS.STREAM).toBe('subscriber') // sanity check
    expect(ig('STREAM', 0)).toBe('subscriber')
})

it('identifies combinations correctly', () => {
    expect(ig('STREAM', groups.STREAM.owner)).toBe('owner')
    expect(ig('PRODUCT', groups.PRODUCT.owner)).toBe('owner')
})

it('identifies custom combinations correctly', () => {
    expect(ig('STREAM', EDIT)).toBe('subscriber')
    expect(ig('STREAM', groups.STREAM.owner - GRANT)).toBe('editor')
    expect(ig('PRODUCT', groups.PRODUCT.owner - EDIT)).toBe('viewer')
})
