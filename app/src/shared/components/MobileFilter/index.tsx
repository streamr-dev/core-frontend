import React, { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { COLORS, TABLET } from '$shared/utils/styled'
import { ButtonActions } from '$shared/components/Buttons'
import Faders from './Faders.svg'

type MobileFilterProps = {
    onChange: (filters: Record<string, string>) => void
    filters: {label: string, value: string, options: {label: string, value: string}[]}[],
    selectedFilters?: Record<string, string>
    children?: ReactNode
}

const MobileFilter: FunctionComponent<MobileFilterProps> = ({filters, onChange, selectedFilters, children }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [selections, setSelections] = useState<Record<string, string>>({})

    useEffect(() => {
        if (selectedFilters && JSON.stringify(selectedFilters) !== JSON.stringify(selections)) {
            setSelections(selectedFilters)
        }
    }, [selectedFilters, selections])

    const handleSelection = (filter: string, value: string): void => {
        setSelections({...selections, [filter]: value})
    }

    const saveSelection = useCallback((clear?: boolean) => {
        onChange(clear ? {} : selections)
        setDialogOpen(false)
    }, [onChange, selections])

    const modalActions = useMemo<ButtonActions>(() => {
        return {
            cancel: {
                title: 'Clear' + (Object.keys(selections).length ? ` (${Object.keys(selections).length})` : ''),
                kind: 'secondary',
                onClick: () => {
                    setSelections({})
                    saveSelection(true)
                },
                className: 'filter-clear-button',
            },
            save: {
                title: 'Save',
                onClick: () => saveSelection(),
                className: 'filter-save-button'
            }
        }
    }, [selections, saveSelection])

    return <>
        <Trigger
            id={'mobile-filter-trigger'}
            onClick={() => setDialogOpen(true)}
            kind={'secondary'}
        >
            {children}<img src={Faders}/>
        </Trigger>
        <ModalPortal>
            {dialogOpen && <FilterDialog
                title={'Filter'}
                showCloseIcon={true}
                contentClassName={'filter-dialog-content'}
                onClose={() => {
                    setDialogOpen(false)
                }}
                actions={modalActions}
                actionsClassName={'filter-action-buttons'}
            >
                {filters.map((filter, filterIndex) => {
                    return <FilterSection key={filter.value + filterIndex}>
                        <p className={'filter-name'}>By {filter.label.toLowerCase()}</p>
                        <form
                            className={'options-list'}
                            onSubmit={(event) => event.preventDefault()}
                            data-can-have-columns={filter.options.length > 8}
                        >
                            {filter.options.map((filterOption, optionIndex) => {
                                return <div key={filterOption.value + optionIndex}>
                                    <label htmlFor={filter.value + '-' + filterOption.value} className={'filter-option'}>
                                        <input
                                            type={'radio'}
                                            id={filter.value + '-' + filterOption.value}
                                            name={filter.value}
                                            value={filterOption.value}
                                            onChange={() => handleSelection(filter.value, filterOption.value)}
                                            checked={selections[filter.value] === filterOption.value}
                                        />
                                        <span className={'filter-options-label'}>{filterOption.label}</span>
                                    </label>
                                </div>
                            })}
                        </form>
                    </FilterSection>
                })}
            </FilterDialog>}
        </ModalPortal>
    </>
}

const Trigger = styled(Button)`
  padding: 0 10px !important;
`

const FilterSection = styled.div`
  width: 100%;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid ${COLORS.separator};
  :first-of-type {
    border: none;
    margin: 0;
    padding: 0;
  }
  
  .options-list {
    &[data-can-have-columns=true] {
      @media(${TABLET}) {
        column-count: 2
      }
    }
  }
`

const FilterDialog = styled(Dialog)`
  
  .filter-dialog-content {
    text-align: left;
    flex: 0;
    align-items: flex-start;
  }
  
  .filter-name {
    font-size: 22px;
    line-height: 28px;
    margin-bottom: 12px;
  }
  
  .filter-option {
    cursor: pointer;
    margin-bottom: 6px;
  }
  
  .filter-options-label {
    margin-left: 16px;
    font-size: 18px;
    line-height: 30px;
  }
  
  .filter-action-buttons {
    button {
      flex: 1
    }
  }
`

export default MobileFilter
