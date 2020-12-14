import React from 'react'
import { mount } from 'enzyme'

import useStreamPath from './useStreamPath'

describe('useStreamPath', () => {
    it('returns legacy id without domain', () => {
        let result

        function Test() {
            result = useStreamPath('mystream-123')

            return null
        }

        mount((
            <Test />
        ))

        expect(result.domain).toBe(undefined)
        expect(result.truncatedDomain).toBe(undefined)
        expect(result.pathname).toBe('mystream-123')
        expect(result.truncatedId).toBe('mystream-123')
    })

    it('returns ENS path without truncation', () => {
        let result

        function Test() {
            result = useStreamPath('streamr.eth/mystream-123')

            return null
        }

        mount((
            <Test />
        ))

        expect(result.domain).toBe('streamr.eth')
        expect(result.truncatedDomain).toBe('streamr.eth')
        expect(result.pathname).toBe('mystream-123')
        expect(result.truncatedId).toBe('streamr.eth/mystream-123')
    })

    it('returns ETH address path with truncation', () => {
        let result

        function Test() {
            result = useStreamPath('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/mystream-123')

            return null
        }

        mount((
            <Test />
        ))

        expect(result.domain).toBe('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1')
        expect(result.truncatedDomain).toBe('0xa3d...47De1')
        expect(result.pathname).toBe('mystream-123')
        expect(result.truncatedId).toBe('0xa3d...47De1/mystream-123')
    })
})
