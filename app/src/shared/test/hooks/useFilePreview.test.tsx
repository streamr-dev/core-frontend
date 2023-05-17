import React from 'react'
import { render } from '@testing-library/react'
import * as preview from '$shared/hooks/useFilePreview'
const useFilePreview = preview.default

describe('useFilePreview', () => {
    it('returns empty preview by default', () => {
        let result

        const Test = () => {
            result = useFilePreview()
            return null
        }

        render(<Test />)
        expect(result.preview).toBeFalsy()
    })
})
