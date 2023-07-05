import { Abi, Address } from '~/shared/types/web3-types'
import { call, getContract } from '~/marketplace/utils/smartContract'
import reverseRecordsAbi from '~/shared/web3/abis/reverseRecords.json'
import getCoreConfig from '~/getters/getCoreConfig'

const config = getCoreConfig()

export const lookupEnsName = async (address: Address): Promise<string> => {
    const contract = getContract(
        { abi: reverseRecordsAbi as Abi, address: config.reverseRecordsAddress },
        true,
        1,
    )
    const response = await call(contract.methods.getNames([address]))
    return response[0]
}
