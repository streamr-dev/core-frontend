// @flow

import { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getWhitelistAddresses } from '$mp/modules/contractProduct/services'
import { whiteListedAddressesSchema, whiteListedAddressSchema } from '$shared/modules/entities/schema'
import useEntities from '$shared/hooks/useEntities'
import type { ProductId } from '$mp/flowtype/product-types'

import { setWhiteListedAddresses, addWhiteListedAddress, removeWhiteListedAddress } from '../actions'
import { selectWhiteListedAddresses } from '../selectors'

type WhitelistParams = {
    productId: ProductId,
    address: string,
    status: string,
    isPending: boolean,
}

export function useWhitelist() {
    const dispatch = useDispatch()
    const { update } = useEntities()

    const items = useSelector(selectWhiteListedAddresses)

    const load = useCallback(async (productId: ProductId, chainId: number) => {
        try {
            const addresses = await getWhitelistAddresses(productId, true, chainId)

            const result = update({
                data: addresses,
                schema: whiteListedAddressesSchema,
            })
            dispatch(setWhiteListedAddresses(productId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const add = useCallback(({ productId, address, status, isPending }: WhitelistParams) => {
        try {
            const result = update({
                data: {
                    address,
                    status,
                    isPending,
                },
                schema: whiteListedAddressSchema,
            })
            dispatch(addWhiteListedAddress(productId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const edit = useCallback(({ address, status, isPending }: WhitelistParams) => {
        try {
            update({
                data: {
                    address,
                    status,
                    isPending,
                },
                schema: whiteListedAddressSchema,
            })
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [update])

    const remove = useCallback(({ productId, address }: WhitelistParams) => {
        try {
            const result = update({
                data: {
                    address,
                    isPending: false,
                },
                schema: whiteListedAddressSchema,
            })
            dispatch(removeWhiteListedAddress(productId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const reset = useCallback((productId: ProductId) => {
        dispatch(setWhiteListedAddresses(productId, []))
    }, [dispatch])

    return useMemo(() => ({
        items,
        load,
        add,
        edit,
        remove,
        reset,
    }), [
        items,
        load,
        add,
        edit,
        remove,
        reset,
    ])
}

export default useWhitelist
