import { cloneDeep } from 'lodash'
import { FeatureFlag, isFeatureEnabled } from '../../utils/isFeatureEnabled'

describe('isFeatureEnabled', () => {
    let defaultLocation: Location

    beforeEach(() => {
        defaultLocation = cloneDeep(window.location)
    })

    afterEach(() => {
        window.location = cloneDeep(defaultLocation)
    })

    const mockWindowLocation = (url: string) => {
        delete window.location
        const newLocation: any = new URL(url)
        newLocation.assign = jest.fn()
        newLocation.replace = jest.fn()
        newLocation.reload = jest.fn()
        window.location = newLocation
    }

    it('should have the phaseTwo feature flag ENABLED on development environment', () => {
        mockWindowLocation('http://localhost')
        expect(isFeatureEnabled(FeatureFlag.PhaseTwo)).toStrictEqual(true)
    })

    it('should have the phaseTwo feature flag ENABLED on staging environment', () => {
        mockWindowLocation('https://staging.streamr.network')
        expect(isFeatureEnabled(FeatureFlag.PhaseTwo)).toStrictEqual(true)
    })

    it('should have the phaseTwo feature flag DISABLED on production environment', () => {
        mockWindowLocation('https://streamr.network')
        expect(isFeatureEnabled(FeatureFlag.PhaseTwo)).toStrictEqual(false)
    })
})
