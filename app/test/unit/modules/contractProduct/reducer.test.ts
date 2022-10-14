import reducer, { initialState } from '$mp/modules/contractProduct/reducer'
import {contractProductConstants} from '$mp/modules/contractProduct/constants'
import { ContractProductState } from '$mp/types/store-state'
import { ErrorFromApi } from '$shared/types/common-types'
describe('contractProduct - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, null)).toStrictEqual(initialState)
    })
    describe('GET_PRODUCT_FROM_CONTRACT', () => {
        it('handles request', () => {
            const expectedState: ContractProductState = {
                id: 'test',
                fetchingContractProduct: true,
                contractProductError: null,
                whitelistedAddresses: [],
            }
            expect(
                reducer(undefined, {
                    type: contractProductConstants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: 'test',
                    },
                }),
            ).toStrictEqual(expectedState)
        })
        it('handles success', () => {
            const expectedState: ContractProductState = {
                id: 'test',
                fetchingContractProduct: false,
                contractProductError: null,
                whitelistedAddresses: [],
            }
            expect(
                reducer(undefined, {
                    type: contractProductConstants.GET_PRODUCT_FROM_CONTRACT_SUCCESS,
                    payload: {
                        id: 'test',
                    },
                }),
            ).toStrictEqual(expectedState)
        })
        it('handles failure', () => {
            const error: ErrorFromApi = {message: 'test error'}
            const expectedState: ContractProductState = {
                id: null,
                fetchingContractProduct: false,
                contractProductError: error,
                whitelistedAddresses: [],
            }
            expect(
                reducer(undefined, {
                    type: contractProductConstants.GET_PRODUCT_FROM_CONTRACT_FAILURE,
                    payload: {
                        id: 'test',
                        error,
                    },
                }),
            ).toStrictEqual(expectedState)
        })
    })
    it('handles CLEAR_CONTRACT_PRODUCT', () => {
        const state: ContractProductState = {
            id: 'test',
            fetchingContractProduct: true,
            contractProductError: {message: 'error'},
            whitelistedAddresses: [],
        }
        const expectedState: ContractProductState = {
            id: null,
            fetchingContractProduct: false,
            contractProductError: null,
            whitelistedAddresses: [],
        }
        expect(
            reducer(state, {
                type: contractProductConstants.CLEAR_CONTRACT_PRODUCT,
                payload: null
            }),
        ).toStrictEqual(expectedState)
    })
})
