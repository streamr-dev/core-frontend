import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import useFilePreview from '$shared/hooks/useFilePreview'

describe('useFilePreview', () => {
    beforeEach(() => {
        URL.revokeObjectURL = jest.fn()
        URL.createObjectURL = jest.fn().mockImplementation((file) => file.name)
    })

    afterEach(() => {
        URL.revokeObjectURL.mockReset()
        URL.createObjectURL.mockReset()
    })

    it('returls empty preview by default', () => {
        let result
        const Test = () => {
            result = useFilePreview()
            return null
        }

        mount(<Test />)

        expect(result.preview).toBeFalsy()
    })

    it('creates a preview', () => {
        let result
        const Test = () => {
            result = useFilePreview()
            return null
        }

        mount(<Test />)

        act(() => {
            result.createPreview(new File([''], 'filename'))
        })

        expect(URL.createObjectURL).toHaveBeenCalled()
        expect(result.preview).toBe('filename')
    })

    it('removes old preview', () => {
        let result
        const Test = () => {
            result = useFilePreview()
            return null
        }

        mount(<Test />)

        act(() => {
            result.createPreview(new File([''], 'filename1'))
        })

        act(() => {
            result.createPreview(new File([''], 'filename2'))
        })

        expect(URL.createObjectURL).toHaveBeenCalledTimes(2)
        expect(URL.revokeObjectURL).toHaveBeenCalled()
        expect(result.preview).toBe('filename2')
    })

    it('removes preview on unmount', () => {
        let result
        const Test = () => {
            result = useFilePreview()
            return null
        }

        const el = mount(<Test />)

        act(() => {
            result.createPreview(new File([''], 'filename1'))
        })

        act(() => {
            el.unmount()
        })

        expect(URL.createObjectURL).toHaveBeenCalled()
        expect(URL.revokeObjectURL).toHaveBeenCalled()
    })
})
