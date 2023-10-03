import React, { forwardRef } from 'react'
import { cleanup, screen, render, fireEvent } from '@testing-library/react'
import { sleep } from '~/utils'

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

class FakeImg {
    onload: () => void
    constructor(public width: number, public height: number) {
        setTimeout(() => {
            this.callOnLoad()
        }, 0)
    }

    private async callOnLoad() {
        while (!this.onload) {
            await sleep(10)
        }

        this.onload()
    }
}

/* eslint-disable object-curly-newline */
describe('CropImageModal', () => {
    let drawSpy

    const prepareTest = (imageWidth: number, imageHeight: number) => {
        drawSpy = jest.fn()
        jest.spyOn(document, 'createElement').mockImplementation((tag: string): any => {
            switch (tag) {
                case 'img':
                    return new FakeImg(imageWidth, imageHeight)
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
            const { getCroppedAndResizedBlob } = await import('./CropImageModal')
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
            const { getCroppedAndResizedBlob } = await import('./CropImageModal')
            const cropSettings = { x: 0, y: 0, width: 0.85, height: 0.85 }
            prepareTest(3000, 3000)
            await getCroppedAndResizedBlob('https://imageUrl', cropSettings)
            expect(drawSpy).toHaveBeenCalledTimes(4)
        })
    })
    it('renders the avatar editor', async () => {
        const { default: CropImageModal } = await import('./CropImageModal')
        render(
            <CropImageModal
                imageUrl="http://"
                onReject={jest.fn()}
                onResolve={jest.fn()}
            />,
        )
        expect(screen.getByText(/Scale and crop your image/)).toBeInTheDocument()
    })
    it('closes the modal', async () => {
        const { default: CropImageModal } = await import('./CropImageModal')
        const closeStub = jest.fn()
        render(
            <CropImageModal
                imageUrl="http://"
                onReject={closeStub}
                onResolve={jest.fn()}
            />,
        )
        fireEvent.click(screen.getByText(/cancel/i))
        expect(closeStub).toHaveBeenCalled()
    })
})
