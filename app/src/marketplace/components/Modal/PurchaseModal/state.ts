import { create } from 'zustand'
import { getProject, getProjectFromRegistry, SmartContractProject, TheGraphPaymentDetails, TheGraphProject } from '$app/src/services/projects'
import { TimeUnit } from '$app/src/shared/types/common-types'

export enum Step {
    SelectChain,
    ChooseAccessPeriod,
    SetAllowance,
    Purchase,
    Complete,
}

interface PurchaseState {
    project: TheGraphProject
    contractProject: SmartContractProject,
    selectedPaymentDetails: TheGraphPaymentDetails,
    selectedTimeUnit: TimeUnit,
    selectedLength: string,
    currentStep: Step,
    error: Error,
    setCurrentStep: (step: Step) => void,
    goBack: () => void,
    setSelectedPaymentDetails: (details: TheGraphPaymentDetails) => void,
    loadProject: (id: string) => void,
    loadContractProject: () => void,
}

export const usePurchaseStore = create<PurchaseState>()((set, get) => ({
    project: null,
    contractProject: null,
    selectedPaymentDetails: null,
    selectedTimeUnit: null,
    selectedLength: null,
    currentStep: Step.SelectChain,
    error: null,
    setCurrentStep: (step: Step) => set({ currentStep: step }),
    goBack: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    setSelectedPaymentDetails: (details) => set({ selectedPaymentDetails: details }),
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
    }
}))
