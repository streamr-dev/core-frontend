import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

jest.mock('$shared/components/ModalPortal', () => ({
    __esModule: true,
    default: ({ children }) => children || null,
}))

const mockGetImage = jest.fn(() => ({
    width: 100,
    height: 100,
    toBlob: (resolve) => resolve('image'),
}))

jest.doMock('react-avatar-editor', () => ({
    __esModule: true,
    default: React.forwardRef((props, ref) => {
        // eslint-disable-next-line no-param-reassign
        ref.current = {
            getImage: mockGetImage,
        }
        return (
            <div id="AvatarEditor" />
        )
    }),
}))

/* eslint-disable object-curly-newline */
describe('CropImageModal', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    afterEach(() => {
    })

    describe('getResizedBlob', () => {
        it('returns the same canvas if smaller than max width', async () => {
            const { getResizedBlob, MAX_WIDTH } = await import('.')

            const originalCanvas = {
                width: 100,
                height: 100,
                toBlob: (resolve) => resolve('image'),
            }
            expect(originalCanvas.width).toBeLessThanOrEqual(MAX_WIDTH)
            const result = await getResizedBlob(originalCanvas)
            expect(result).toBe('image')
        })

        it('returns a resized canvas if smaller than max width', async () => {
            const { getResizedBlob, MAX_WIDTH } = await import('.')

            const nextCanvas = {
                width: undefined,
                height: undefined,
                getContext: () => ({
                    drawImage: jest.fn(),
                }),
                toBlob: (resolve) => resolve('nextImage'),
            }

            jest.spyOn(document, 'createElement').mockImplementation(() => nextCanvas)
            const originalCanvas = {
                width: 2000,
                height: 2000,
            }
            expect(originalCanvas.width).toBeGreaterThan(MAX_WIDTH)

            const result = await getResizedBlob(originalCanvas)
            expect(result).toBe('nextImage')
            expect(nextCanvas.width).toBe(MAX_WIDTH)
        })
    })

    it('renders the avatar editor', async () => {
        const { default: CropImageModal } = await import('.')
        let el

        await act(async () => {
            el = await mount((
                <CropImageModal
                    imageUrl="http://"
                    onClose={jest.fn()}
                    onSave={jest.fn()}
                />
            ))
        })
        expect(el.find({ id: 'AvatarEditor' }).exists()).toBe(true)
    })

    it('closes the modal', async () => {
        const { default: CropImageModal } = await import('.')
        const closeStub = jest.fn()
        const el = mount((
            <CropImageModal
                imageUrl="http://"
                onClose={closeStub}
                onSave={jest.fn()}
            />
        ))

        await act(async () => {
            await el.find('button').at(0).simulate('click')
        })

        expect(closeStub).toHaveBeenCalled()
    })

    it('calls the save prop with edited image', async () => {
        const { default: CropImageModal } = await import('.')
        const saveStub = jest.fn()
        let el
        await act(async () => {
            el = await mount((
                <CropImageModal
                    imageUrl="http://"
                    onClose={jest.fn()}
                    onSave={saveStub}
                />
            ))
        })

        await act(async () => {
            await el.find('button').at(1).simulate('click')
        })
        expect(saveStub).toHaveBeenCalled()
    })
})
/* eslint-enable object-curly-newline */
