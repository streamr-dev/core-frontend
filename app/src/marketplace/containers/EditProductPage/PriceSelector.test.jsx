import React, { useContext, useMemo, useState } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'

import * as UndoContext from '$shared/contexts/Undo'
import Select from '$ui/Select'
import getChainId from '$utils/web3/getChainId'
import { Provider as ValidationContextProvider } from '../ProductController/ValidationContextProvider'
import * as BeneficiaryAddress from './BeneficiaryAddress'
import PriceSelector from './PriceSelector'
import { Context as EditControllerContext } from './EditControllerProvider'

jest.mock('$utils/web3/getChainId', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockChainId(chainId) {
    return getChainId.mockImplementation(() => Promise.resolve(chainId))
}

const mockState = {
    product: {
        id: '1',
    },
    contractProduct: {
        id: '1',
    },
    dataUnion: {
        id: 'dataUnionId',
    },
    entities: {
        products: {
            '1': {
                id: '1',
            },
        },
        contractProducts: {
            '1': {
                id: '1',
            },
        },
        dataUnions: {
            dataUnionId: {
                id: 'dataUnionId',
            },
        },
        dataUnionStats: {
            dataUnionId: {
                id: 'dataUnionId',
                memberCount: {
                    active: 0,
                },
            },
        },
    },
}

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation((selectorFn) => selectorFn(mockState)),
    useDispatch: jest.fn(),
}))

describe('PriceSelector', () => {
    beforeEach(() => {
        jest.spyOn(BeneficiaryAddress, 'default').mockImplementation(() => null)
        mockChainId(1)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    // eslint-disable-next-line react/prop-types
    const EditContextWrap = ({ children }) => {
        const [preferredCurrency, setPreferredCurrency] = useState('DATA')

        const value = useMemo(() => ({
            preferredCurrency,
            setPreferredCurrency,
        }), [
            preferredCurrency,
            setPreferredCurrency,
        ])

        return (
            <EditControllerContext.Provider value={value}>
                {children}
            </EditControllerContext.Provider>
        )
    }

    const setup = async (product, transform) => {
        let undoContext

        const WrappedPriceSelector = () => {
            undoContext = useContext(UndoContext.Context)
            const { state } = undoContext
            return state && state.id ? <PriceSelector /> : null
        }

        const el = mount((
            <MemoryRouter>
                <EditContextWrap>
                    <UndoContext.Provider>
                        <ValidationContextProvider>
                            <WrappedPriceSelector />
                        </ValidationContextProvider>
                    </UndoContext.Provider>
                </EditContextWrap>
            </MemoryRouter>
        ))

        await act(async () => {
            await undoContext.replace(() => product)
        })

        el.update()

        if (transform) {
            transform(el)
        }

        return undoContext.state
    }

    it('sets amount', async () => {
        const { price, pricePerSecond, timeUnit } = await setup({
            id: '1',
            price: '1',
            pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            timeUnit: 'second',
        }, (el) => {
            el
                .find('.inputWrapper input')
                .first()
                .simulate('change', {
                    target: {
                        value: '10',
                    },
                })
                .simulate('blur')
        })

        expect(price.toString()).toBe('10')
        expect(pricePerSecond.toString()).toBe('10')
        expect(timeUnit).toBe('second')
    })

    it('changes time unit + updates amounts', async () => {
        const { price, pricePerSecond, timeUnit } = await setup({
            id: '1',
            price: '7200',
            pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            pricePerSecond: '7200',
            timeUnit: 'second',
        }, (el) => {
            act(() => {
                el.find(Select).props().onChange({
                    value: 'hour',
                })
            })
        })

        expect(price.toString()).toBe('7200')
        expect(pricePerSecond.toString()).toBe('2')
        expect(timeUnit).toBe('hour')
    })
})
