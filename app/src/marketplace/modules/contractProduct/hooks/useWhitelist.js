import { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getWhitelistAddresses } from '$mp/modules/contractProduct/services'
import { whiteListedAddressesSchema, whiteListedAddressSchema } from '$shared/modules/entities/schema'
import useEntities from '$shared/hooks/useEntities'

import { setWhiteListedAddresses, addWhiteListedAddress, removeWhiteListedAddress } from '../actions'
import { selectWhiteListedAddresses } from '../selectors'

export function useWhitelist() {
    const dispatch = useDispatch()
    const { update } = useEntities()

    const items = useSelector(selectWhiteListedAddresses)

    const load = useCallback(async (productId) => {
        try {
            const addresses = await getWhitelistAddresses(productId)

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

    const add = useCallback(({ productId, address, status, isPending }) => {
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

    const edit = useCallback(({ address, status, isPending }) => {
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

    const remove = useCallback(({ productId, address }) => {
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

    const reset = useCallback((productId) => {
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
