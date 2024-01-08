import React, { useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { RadioCircle } from '~/components/SalePointSelector/SalePointOption'
import FormModal, { FormModalProps } from '~/modals/FormModal'
import { TheGraph } from '~/shared/types'
import { Layer } from '~/utils/Layer'

interface Props extends Pick<FormModalProps, 'onReject'> {
    onResolve?: (value?: TheGraph.ProjectType) => void
    value?: TheGraph.ProjectType
}

function ProjectTypeFilterModal({ onResolve, value, ...props }: Props) {
    const [localValue, setLocalValue] = useState<TheGraph.ProjectType | undefined>(value)

    return (
        <FormModal
            title="Filter"
            submitLabel="Save"
            {...props}
            onSubmit={() => {
                onResolve?.(localValue)
            }}
        >
            <Body>
                <h4>By project type</h4>
                <ul>
                    <li>
                        <button
                            type="button"
                            onClick={() => {
                                setLocalValue(undefined)
                            }}
                        >
                            <RadioCircle $checked={!localValue} />
                            Any
                        </button>
                    </li>
                    {productTypeOptions.map(({ value, label }) => (
                        <li key={value}>
                            <button
                                type="button"
                                onClick={() => {
                                    setLocalValue(value)
                                }}
                            >
                                <RadioCircle $checked={localValue === value} />
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </Body>
        </FormModal>
    )
}

export const projectTypeFilterModal = toaster(ProjectTypeFilterModal, Layer.Modal)

const productTypeOptions = [
    {
        value: TheGraph.ProjectType.Open,
        label: 'Open data',
    },
    {
        value: TheGraph.ProjectType.Paid,
        label: 'Paid data',
    },
    {
        value: TheGraph.ProjectType.DataUnion,
        label: 'Data union',
    },
]

const Body = styled.div`
    font-size: 16px;

    button {
        appearance: none;
        align-items: center;
        display: flex;
        border: 0;
        background: none;
        padding: 0;
        gap: 8px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li + li {
        margin-top: 8px;
    }

    h4 {
        font-size: 22px;
        font-weight: 400;
        margin: 0 0 20px;
    }
`
