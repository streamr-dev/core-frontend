import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { cloneDeep } from 'lodash'
import { FeatureFlag, useHasFeatureFlag } from '../../hooks/useHasFeatureFlag'

describe('useHasFeatureFlag', () => {
    let defaultLocation: Location
    let renderResult: RenderResult

    let hasFeatureFlag: boolean

    beforeEach(() => {
        defaultLocation = cloneDeep(window.location)
    })

    afterEach(() => {
        window.location = cloneDeep(defaultLocation)
        hasFeatureFlag = undefined
        renderResult.unmount()
    })

    const prepareTest = (flag: FeatureFlag, url: string) => {
        delete window.location
        const newLocation: any = new URL(url)
        newLocation.assign = jest.fn()
        newLocation.replace = jest.fn()
        newLocation.reload = jest.fn()
        window.location = newLocation
        const TestComponent = () => {
            hasFeatureFlag = useHasFeatureFlag(flag)
            return <></>
        }
        renderResult = render(<TestComponent />)
    }

    it('should have the phaseTwo feature flag ENABLED on development environment', () => {
        prepareTest(FeatureFlag.phaseTwo, 'http://localhost')
        expect(hasFeatureFlag).toStrictEqual(true)
    })

    it('should have the phaseTwo feature flag ENABLED on staging environment', () => {
        prepareTest(FeatureFlag.phaseTwo, 'https://staging.streamr.network')
        expect(hasFeatureFlag).toStrictEqual(true)
    })

    it('should have the phaseTwo feature flag DISABLED on production environment', () => {
        prepareTest(FeatureFlag.phaseTwo, 'https://streamr.network')
        expect(hasFeatureFlag).toStrictEqual(false)
    })
})
