import { create } from 'zustand'
import { getProject, getProjectFromRegistry, SmartContractProject, TheGraphPaymentDetails, TheGraphProject } from '$app/src/services/projects'
import { purchaseProject } from '$shared/web3/purchase'
import { approve, needsAllowance } from '$shared/web3/allowance'
import { getTokenInformation } from '$app/src/marketplace/utils/web3'
import {TimeUnit} from "$shared/utils/timeUnit"

export enum Step {
    SelectChain,
    ChooseAccessPeriod,
    SetAllowance,
    Purchase,
    AccessProgress,
    Complete,
}

type Actions = {
    setCurrentStep: (step: Step) => void,
    goBack: () => void,
    setSelectedPaymentDetails: (details: TheGraphPaymentDetails) => Promise<void>,
    setSelectedLength: (length: string) => void,
    setSelectedTimeUnit: (length: string) => void
    loadProject: (id: string) => void,
    loadContractProject: () => void,
    purchase: () => void,
    needsAllowance: () => Promise<boolean>,
    approveAllowance: () => void,
    setError: (e: Error) => void,
    reset: () => void,
}

type State = {
    isLoading: boolean,
    project: TheGraphProject,
    contractProject: SmartContractProject,
    selectedPaymentDetails: TheGraphPaymentDetails,
    selectedTimeUnit: TimeUnit,
    selectedLength: string,
    currentStep: Step,
    chainId: number,
    tokenSymbol: string,
    tokenDecimals: number,
    error: Error,
}

const initialState: State = {
    isLoading: false,
    project: null,
    contractProject: null,
    selectedPaymentDetails: null,
    selectedTimeUnit: null,
    selectedLength: null,
    currentStep: Step.SelectChain,
    chainId: null,
    tokenSymbol: null,
    tokenDecimals: 18,
    error: null,
}

export const usePurchaseStore = create<State & Actions>()((set, get) => ({
    ...initialState,
    setCurrentStep: (step: Step) => set({ currentStep: step }),
    goBack: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    setSelectedPaymentDetails: async (details) => {
        set({ selectedPaymentDetails: details })

        if (details != null) {
            // Set chainId based on selection
            const parsedChainId = Number.parseInt(details.domainId)
            if (!Number.isSafeInteger(parsedChainId)) {
                console.error("Invalid paymentDetails chain! domainId is not a number", details.domainId)
            }
            set({ chainId: parsedChainId })

            // Fetch token details
            set({ isLoading: true })
            const tokenInfo = await getTokenInformation(details.pricingTokenAddress, parsedChainId)
            set({ isLoading: false })
            if (tokenInfo != null) {
                set({
                    tokenDecimals: tokenInfo.decimals,
                    tokenSymbol: tokenInfo.symbol,
                })
            }
        }
    },
    setSelectedLength: (length: string) => set({ selectedLength: length }),
    setSelectedTimeUnit: (timeUnit: TimeUnit) => set({ selectedTimeUnit: timeUnit }),
    loadProject: async (id: string) => {
        try {
            set({ isLoading: true })
            const proj = await getProject(id)
            set({ isLoading: false })
            set({ project: proj })
        } catch (e) {
            set({ error: e })
        }
    },
    loadContractProject: async () => {
        const project = get().project
        const pd = get().selectedPaymentDetails
        if (project != null && pd != null) {
            try {
                set({ isLoading: true })
                const proj = await getProjectFromRegistry(project.id, [pd.domainId], true)
                set({ isLoading: false })
                set({ contractProject: proj })
            } catch (e) {
                set({ error: e })
            }
        }
    },
    purchase: async () => {
        const {
            contractProject,
            selectedLength,
            selectedTimeUnit,
            chainId,
            setError,
            setCurrentStep,
        } = get()

        try {
            const purchaseTx = await purchaseProject({
                contractProject,
                chainId,
                length: selectedLength,
                timeUnit: selectedTimeUnit,
            })

            purchaseTx
                .onTransactionHash((hash) => {
                    setCurrentStep(Step.AccessProgress)
                })
                .onTransactionComplete(() => {
                    setCurrentStep(Step.Complete)
                })
                .onError((error) => {
                    setError(error)
                    setCurrentStep(Step.ChooseAccessPeriod)
                })
        } catch (e) {
            setError(e)
            setCurrentStep(Step.ChooseAccessPeriod)
            return
        }
    },
    needsAllowance: async () => {
        const {
            contractProject,
            selectedLength,
            selectedTimeUnit,
            chainId,
        } = get()

        const shouldSetAllowance = await needsAllowance({
            contractProject,
            chainId,
            length: selectedLength,
            timeUnit: selectedTimeUnit,
        })
        return shouldSetAllowance
    },
    approveAllowance: async () => {
        const {
            contractProject,
            selectedLength,
            selectedTimeUnit,
            chainId,
            setError,
            setCurrentStep,
        } = get()

        try {
            const approveTx = approve({
                contractProject,
                chainId,
                length: selectedLength,
                timeUnit: selectedTimeUnit,
            })

            approveTx
                .onTransactionHash((hash) => {
                })
                .onTransactionComplete(() => {
                    setCurrentStep(Step.Purchase)
                })
                .onError((error) => {
                    setError(error)
                    setCurrentStep(Step.ChooseAccessPeriod)
                })
        } catch (e) {
            setError(e)
            setCurrentStep(Step.ChooseAccessPeriod)
            return
        }
    },
    setError: (error: Error) => {
        console.error(error)
        set({ error: error })
    },
    reset: () => set(initialState),
}))
