import React, { forwardRef } from 'react'
import { cleanup, screen, render, fireEvent, waitFor } from '@testing-library/react'
jest.mock('~/shared/components/ModalPortal', () => ({
    __esModule: true,
    default: ({ children }) => children || null,
}))
const mockGetImage = jest.fn(() => ({
    width: 100,
    height: 100,
    toBlob: (resolve) => resolve('image'),
}))
const mockGetCroppingRect = jest.fn(() => ({
    x: 0,
    y: 0,
    width: 0.5,
    height: 0.5,
}))
jest.doMock('react-avatar-editor', () => ({
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: forwardRef((props, ref: any) => {
        // eslint-disable-next-line no-param-reassign
        ref.current = {
            getImage: mockGetImage,
            getCroppingRect: mockGetCroppingRect,
        }
        return <div id="AvatarEditor" />
    }),
}))

/* eslint-disable object-curly-newline */
describe('CropImageModal', () => {
    let drawSpy

    const prepareTest = (imageWidth: number, imageHeight: number) => {
        drawSpy = jest.fn()
        jest.spyOn(document, 'createElement').mockImplementation((tag: string): any => {
            switch (tag) {
                case 'img':
                    return {
                        width: imageWidth,
                        height: imageHeight,
                    }
                case 'canvas':
                    return {
                        width: 0,
                        height: 9,
                        getContext: () => ({
                            drawImage: drawSpy,
                        }),
                        toBlob: (resolve) => resolve('crppedImage'),
                    }
            }
        })
    }
    beforeEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    afterEach(cleanup)
    describe('getResizedBlob', () => {
        it('returns the same image if smaller than max width', async () => {
            const { getCroppedAndResizedBlob, MAX_WIDTH } = await import('./index')
            const cropSettings = { x: 0, y: 0, width: 0.5, height: 0.5 }
            prepareTest(400, 400)
            const result = await getCroppedAndResizedBlob(
                'https://imageUrl',
                cropSettings,
            )
            expect(drawSpy).toHaveBeenCalledTimes(1)
            expect(result).toBe('crppedImage')
        })
        it('returns a resized image if bigger than max width', async () => {
            const { getCroppedAndResizedBlob, MAX_WIDTH } = await import('./index')
            const cropSettings = { x: 0, y: 0, width: 0.85, height: 0.85 }
            prepareTest(3000, 3000)
            const result = await getCroppedAndResizedBlob(
                'https://imageUrl',
                cropSettings,
            )
            expect(drawSpy).toHaveBeenCalledTimes(4)
        })
    })
    it('renders the avatar editor', async () => {
        const { default: CropImageModal } = await import('./index')
        render(
            <CropImageModal imageUrl="http://" onClose={jest.fn()} onSave={jest.fn()} />,
        )
        expect(screen.getByText(/Scale and crop your image/)).toBeInTheDocument()
    })
    it('closes the modal', async () => {
        const { default: CropImageModal } = await import('./index')
        const closeStub = jest.fn()
        render(
            <CropImageModal imageUrl="http://" onClose={closeStub} onSave={jest.fn()} />,
        )
        fireEvent.click(screen.getByText(/cancel/i))
        expect(closeStub).toHaveBeenCalled()
    })
})
