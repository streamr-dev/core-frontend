import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import * as preview from '$shared/hooks/useFilePreview'
const useFilePreview = preview.default

describe('useFilePreview', () => {
    it('returls empty preview by default', () => {
        let result

        const Test = () => {
            result = useFilePreview()
            return null
        }

        mount(<Test />)
        expect(result.preview).toBeFalsy()
    })
    it('creates a preview', async () => {
        jest.spyOn(preview, 'toBase64').mockImplementation(async () => 'base64')
        let result

        const Test = () => {
            result = useFilePreview()
            return null
        }

        mount(<Test />)
        await act(async () => {
            await result.createPreview(new File(['foo'], 'filename'))
            expect(result.preview).toBe('base64')
        })
    })
})
