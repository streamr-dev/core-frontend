import {Address} from "$shared/types/web3-types"

export type Authentication = {
    method: string,
    address: Address,
    ensName?: string
}
