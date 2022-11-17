import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import useModal from '$shared/hooks/useModal'
import type { CategoryFilter, Filter, ProjectTypeFilter, SearchFilter } from '$mp/types/project-types'
import SearchBar from '$shared/components/SearchBar'
import {
    CreateProjectButton,
    DropdownFilters,
    FiltersBar,
    FiltersWrap, MobileFilterText,
    MobileFilterWrap,
    SearchBarWrap,
    SelectFieldWrap
} from '$mp/components/ActionBar/actionBar.styles'
import Tabs from '$shared/components/Tabs'
import SelectField2 from '$mp/components/SelectField2'
import MobileFilter from '$shared/components/MobileFilter'
import type { Category } from '../../types/category-types'
import { isValidSearchQuery } from '../../utils/validate'

export type Props = {
    filter: Filter
    categories: Array<Category> | null | undefined
    onFilterChange: (filter: Filter) => void
    onSearchChange: (search: SearchFilter) => void
    onCreateProject: () => void
}

const UnstyledActionBar = ({
    filter,
    categories,
    onCreateProject,
    onFilterChange: onFilterChangeProp,
    onSearchChange: onSearchChangeProp,
    ...props
}: Props) => {
    const { api: filterModal } = useModal('marketplace.filter')
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
            filterModal.close()
        },
        [onFilterChangeProp, filterModal],
    )

    const onProductTypeChange = useCallback(
        (type: ProjectTypeFilter | null | undefined) => {
            onFilterChangeProp({
                type,
            })
            filterModal.close()
        },
        [onFilterChangeProp, filterModal],
    )

    const productTypeOptions = useMemo(
        () => [
            {
                value: 'normal',
                label: 'Data Projects',
            },
            {
                value: 'dataunion',
                label: 'Data Unions',
            },
        ],
        [],
    )
    const categoryOptions = useMemo(
        () => categories.map((category) => ({label: category.name, value: category.id})),
        [categories],
    )

    const { categories: category, type } = filter

    const onTabFilterChange = (value: string): void => {
        // TODO implement
    }

    const handleMobileFilterChange = (filters: Record<string, string>): void => {
        onCategoryChange(filters.category)
        onProductTypeChange(filters.type)
    }

    return (
        <div {...props}>
            <SearchBarWrap>
                <SearchBar value={filter.search} onChange={onSearchChange}/>
            </SearchBarWrap>
            <FiltersBar>
                <FiltersWrap>
                    <Tabs
                        options={
                            [
                                {
                                    label: 'All projects',
                                    value: 'all_projects'
                                },
                                {
                                    label: 'Your projects',
                                    value: 'your_projects',
                                    disabled: true,
                                    disabledReason: "This feature will be implemented soon"
                                }
                            ]
                        }
                        selectedOptionValue={'all_projects'}
                        onChange={onTabFilterChange}
                        fullWidth={'onlyMobile'}
                    />
                    <DropdownFilters>
                        <span>Filter by</span>
                        <SelectFieldWrap>
                            <SelectField2
                                placeholder={'Category'}
                                options={categoryOptions}
                                value={category}
                                onChange={onCategoryChange}
                            />
                        </SelectFieldWrap>
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
                                    label: 'Category',
                                    value: 'category',
                                    options: categoryOptions
                                },
                                {
                                    label: 'Project type',
                                    value: 'type',
                                    options: productTypeOptions
                                }
                            ]}
                            onChange={handleMobileFilterChange}
                            selectedFilters={{category, type }}
                        >
                            <MobileFilterText>Filter</MobileFilterText>
                        </MobileFilter>
                    </MobileFilterWrap>
                </FiltersWrap>
                <CreateProjectButton kind={'primary'} type={'button'} onClick={() => onCreateProject()}>Create project</CreateProjectButton>
            </FiltersBar>
        </div>
    )
}

const ActionBar = styled(UnstyledActionBar)`
`
export default ActionBar
