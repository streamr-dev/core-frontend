import { Contract } from 'ethers'
import {
    operatorFactoryABI,
    operatorABI,
    OperatorFactory,
    Operator,
} from '@streamr/network-contracts'
import { parseEther } from 'ethers/lib/utils'
import { getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { Address } from '~/shared/types/web3-types'
import { getERC20TokenContract } from '~/getters'
import { BNish, toBN } from '~/utils/bn'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { toastedOperation } from '~/utils/toastedOperation'
import { postImage } from '~/services/images'

const getOperatorChainId = () => {
    return defaultChainConfig.id
}

export async function createOperator(
    operatorCut: number,
    name: string,
    description?: string,
    imageToUpload?: File,
) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const walletAddress = await signer.getAddress()

    const imageIpfsCid = imageToUpload ? await postImage(imageToUpload) : undefined

    const factory = new Contract(
        chainConfig.contracts['OperatorFactory'],
        operatorFactoryABI,
        signer,
    ) as OperatorFactory

    const metadata = {
        name,
        description,
        imageIpfsCid,
    }

    /**
     * - stringArgs[0] is poolTokenName - each operator contract creates its own token which is used
     * for accounting and here we're defining its name
     * - stringArgs[1] i metadata object as a JSON
     * the metadata object should contain name and description fields
     */
    const stringArgs: [string, string] = [
        `StreamrOperator-${walletAddress.slice(-5)}`,
        JSON.stringify(metadata),
    ]

    const policies: [Address, Address, Address] = [
        chainConfig.contracts.OperatorDefaultDelegationPolicy,
        chainConfig.contracts.OperatorDefaultPoolYieldPolicy,
        chainConfig.contracts.OperatorDefaultUndelegationPolicy,
    ]

    //hardcoded now, will be moved to global config later
    const minimumMarginFraction = parseEther('1').mul(10).div(100)
    const operatorsShareFraction = parseEther('1').mul(operatorCut).div(100)

    const initParams = [
        0,
        minimumMarginFraction,
        0,
        0,
        parseEther('1'), // initialMinimumDelegationWei - will be moved to global config
        operatorsShareFraction,
    ]

    await toastedOperation('Operator deployment', async () => {
        const tx = await factory.deployOperator(stringArgs, policies, initParams)
        await tx.wait()
    })
}

export async function delegateToOperator(operatorId: string, amount: BNish) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tokenContract = getERC20TokenContract({
        tokenAddress: chainConfig.contracts['DATA'],
        signer,
    })

    const tokenTx = await tokenContract.approve(operatorId, toBN(amount).toString())

    await tokenTx.wait()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    const operatorTx = await operatorContract.delegate(toBN(amount).toString())

    await operatorTx.wait()
}

export async function undelegateFromOperator(operatorId: string, amount: BNish) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tokenContract = getERC20TokenContract({
        tokenAddress: chainConfig.contracts['DATA'],
        signer,
    })

    const tokenTx = await tokenContract.approve(operatorId, toBN(amount).toString())

    await tokenTx.wait()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    const operatorTx = await operatorContract.undelegate(toBN(amount).toString())

    await operatorTx.wait()
}

export async function getOperatorDelegationAmount(operatorId: string, address: string) {
    const chainId = getOperatorChainId()

    await networkPreflight(chainId)

    const provider = getPublicWeb3Provider(chainId)
    const operatorContract = new Contract(operatorId, operatorABI, provider) as Operator
    const amount = await operatorContract.balanceOf(address)
    return toBN(amount)
}
