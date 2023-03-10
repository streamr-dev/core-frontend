import { create } from 'zustand'
import { getProject, getProjectFromRegistry, SmartContractProject, TheGraphPaymentDetails, TheGraphProject } from '$app/src/services/projects'
import { TimeUnit } from '$shared/types/common-types'
import Transaction from '$shared/utils/Transaction'

export enum Step {
    SelectChain,
    ChooseAccessPeriod,
    SetAllowance,
    Purchase,
    Complete,
}

type Actions = {
    setCurrentStep: (step: Step) => void,
    goBack: () => void,
    setSelectedPaymentDetails: (details: TheGraphPaymentDetails) => void,
    setSelectedLength: (length: string) => void,
    setSelectedTimeUnit: (length: string) => void
    loadProject: (id: string) => void,
    loadContractProject: () => void,
    purchase: () => void,
    needsAllowance: (needsAllowanceFn: (params: any) => Promise<boolean>) => Promise<boolean>,
    approveAllowance: (approveFn: (params: any) => Transaction) => void,
    setError: (e: Error) => void,
    reset: () => void,
}

type State = {
    project: TheGraphProject,
    contractProject: SmartContractProject,
    selectedPaymentDetails: TheGraphPaymentDetails,
    selectedTimeUnit: TimeUnit,
    selectedLength: string,
    currentStep: Step,
    chainId: number,
    error: Error,
}

const initialState: State = {
    project: null,
    contractProject: null,
    selectedPaymentDetails: null,
    selectedTimeUnit: null,
    selectedLength: null,
    currentStep: Step.SelectChain,
    chainId: null,
    error: null,
}

export const usePurchaseStore = create<State & Actions>()((set, get) => ({
    ...initialState,
    setCurrentStep: (step: Step) => set({ currentStep: step }),
    goBack: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    setSelectedPaymentDetails: (details) => {
        set({ selectedPaymentDetails: details })
        // Set chainId based on selection
        if (details != null) {
            const parsedChainId = Number.parseInt(details.domainId)
            if (!Number.isSafeInteger(parsedChainId)) {
                console.error("Invalid paymentDetails chain! domainId is not a number", details.domainId)
            }
            set({ chainId: parsedChainId })
        }
    },
    setSelectedLength: (length: string) => set({ selectedLength: length }),
    setSelectedTimeUnit: (timeUnit: TimeUnit) => set({ selectedTimeUnit: timeUnit }),
    loadProject: async (id: string) => {
        try {
            const proj = await getProject(id)
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
                const proj = await getProjectFromRegistry(project.id, [pd.domainId], true)
                set({ contractProject: proj })
            } catch (e) {
                set({ error: e })
            }
        }
    },
    purchase: async () => {

    },
    needsAllowance: async (needsAllowanceFn) => {
        const {
            contractProject,
            selectedLength,
            selectedTimeUnit,
            chainId,
        } = get()

        console.log('allowance check')
        const shouldSetAllowance = await needsAllowanceFn({
            contractProject,
            chainId,
            length: selectedLength,
            timeUnit: selectedTimeUnit,
        })
        return shouldSetAllowance
    },
    approveAllowance: async (approveFn) => {
        const {
            contractProject,
            selectedLength,
            selectedTimeUnit,
            chainId,
            setError,
            setCurrentStep,
        } = get()

        try {
            console.log('start approve')
            const approveTx = approveFn({
                contractProject,
                chainId,
                length: selectedLength,
                timeUnit: selectedTimeUnit,
            })

            approveTx
                .onTransactionHash((hash) => {
                    console.log('started', hash)
                })
                .onTransactionComplete(() => {
                    console.log('complete')
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
    setError: (error: Error) => set({ error: error }),
    reset: () => set(initialState),
}))
