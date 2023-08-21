import { TheGraph } from '~/shared/types'

export interface ProjectFilter {
    search: string
    type?: TheGraph.ProjectType | undefined
    owner?: string | undefined
}
