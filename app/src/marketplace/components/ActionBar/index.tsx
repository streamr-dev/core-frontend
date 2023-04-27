import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { CategoryFilter, Filter, ProjectTypeFilter, SearchFilter } from '$mp/types/project-types'
import SearchBar from '$shared/components/SearchBar'
import {
    ActionBarContainer,
    CreateProjectButton,
    DropdownFilters,
    FiltersBar,
    FiltersWrap, MobileFilterText,
    MobileFilterWrap,
    SearchBarWrap,
    SelectFieldWrap
} from '$mp/components/ActionBar/actionBar.styles'
import SelectField2 from '$mp/components/SelectField2'
import MobileFilter from '$shared/components/MobileFilter'
import { ProjectListingTypeFilter } from "$app/src/services/projects"
import Tabs, { Tab } from '$shared/components/Tabs'
import { Category } from '../../types/category-types'
import { isValidSearchQuery } from '../../utils/validate'

enum ProjectsScope {
    Any = 'any',
    Owned = 'owned',
}

export type Props = {
    filter: Filter
    categories: Array<Category> | null | undefined
    onFilterChange: (filter: Filter) => void
    onSearchChange: (search: SearchFilter) => void
    onCreateProject: () => void
    onFilterByAuthorChange: (myProjects: boolean) => void
    isUserAuthenticated: boolean
}

const productTypeOptions = [
    {
        value: ProjectListingTypeFilter.openData,
        label: 'Open data',
    },
    {
        value: ProjectListingTypeFilter.paidData,
        label: 'Paid data'
    },
]

const UnstyledActionBar = ({
    filter,
    categories,
    onCreateProject,
    onFilterChange: onFilterChangeProp,
    onSearchChange: onSearchChangeProp,
    onFilterByAuthorChange,
    isUserAuthenticated,
    ...props
}: Props) => {
    const onSearchChange = useCallback(
        (search: SearchFilter) => {
            if (isValidSearchQuery(search)) {
                onSearchChangeProp(search)
            }
        },
        [onSearchChangeProp],
    )
    const onCategoryChange = useCallback(
        (category: CategoryFilter | null | undefined) => {
            onFilterChangeProp({
                categories: category !== '__all' ? category : undefined,
            })
        },
        [onFilterChangeProp],
    )

    const onProductTypeChange = useCallback(
        (type: ProjectTypeFilter | null | undefined) => {
            onFilterChangeProp({
                type,
            })
        },
        [onFilterChangeProp],
    )

    const { categories: category, type } = filter

    const handleMobileFilterChange = (filters: Record<string, string>): void => {
        onCategoryChange(filters.category)
        onProductTypeChange(filters.type)
    }

    const [scope, setScope] = useState<ProjectsScope>(ProjectsScope.Any)

    return (
        <ActionBarContainer {...props}>
            <SearchBarWrap>
                <SearchBar value={filter.search} onChange={onSearchChange}/>
            </SearchBarWrap>
            <FiltersBar>
                <FiltersWrap>
                    <Tabs
                        selection={scope}
                        onSelectionChange={(id) => {
                            onFilterByAuthorChange(id === ProjectsScope.Owned)
                            setScope(id as ProjectsScope)
                        }}
                    >
                        <Tab id={ProjectsScope.Any}>All projects</Tab>
                        <Tab
                            id={ProjectsScope.Owned}
                            disabled={!isUserAuthenticated}
                            title={isUserAuthenticated ? undefined : 'You need to be connected in to view your projects'}
                        >
                            Your projects
                        </Tab>
                    </Tabs>
                    <DropdownFilters>
                        <span>Filter by</span>
                        <SelectFieldWrap>
                            <SelectField2
                                placeholder={'Project type'}
                                options={productTypeOptions}
                                value={type}
                                onChange={onProductTypeChange}
                            />
                        </SelectFieldWrap>
                    </DropdownFilters>
                    <MobileFilterWrap>
                        <MobileFilter
                            filters={[
                                {
                                    label: 'Project type',
                                    value: 'type',
                                    options: productTypeOptions
                                }
                            ]}
                            onChange={handleMobileFilterChange}
                            selectedFilters={{ category, type }}
                        >
                            <MobileFilterText>Filter</MobileFilterText>
                        </MobileFilter>
                    </MobileFilterWrap>
                </FiltersWrap>
                <CreateProjectButton kind={'primary'} type={'button'} onClick={() => onCreateProject()}>Create project</CreateProjectButton>
            </FiltersBar>
        </ActionBarContainer>
    )
}

const ActionBar = styled(UnstyledActionBar)`
`
export default ActionBar
