import React from 'react'
import styled from 'styled-components'
import { getEmptyParsedProject } from '~/parsers/ProjectParser'
import TextField from '~/shared/components/Ui/Text/StyledInput'
import { ProjectDraft } from '~/stores/projectDraft'
import { ProjectType } from '~/shared/types'
import { COLORS } from '~/shared/utils/styled'

export default function DataUnionFee({ disabled = false }: { disabled?: boolean }) {
    const update = ProjectDraft.useUpdateEntity()

    const emptyProject = getEmptyParsedProject({ type: ProjectType.OpenData })

    const project = ProjectDraft.useEntity({ hot: true }) || emptyProject

    const coldProject = ProjectDraft.useEntity() || emptyProject

    const isDataUnion = project.type === ProjectType.DataUnion

    return (
        <Root>
            <p>Set the fee you receive from this Data Union (% of total&nbsp;sales)</p>
            <InputWrap>
                <TextField
                    placeholder="0"
                    value={(isDataUnion && project.adminFee) || ''}
                    readOnly={!isDataUnion}
                    disabled={disabled}
                    onChange={(e) => {
                        update((draft) => {
                            if (draft.type !== ProjectType.DataUnion) {
                                return
                            }

                            if (coldProject.type !== draft.type) {
                                throw new Error(
                                    'Cold and hot projects have different type, lol. Code much?',
                                )
                            }

                            draft.adminFee = e.target.value
                        })
                    }}
                />
                <Appendix>%</Appendix>
            </InputWrap>
        </Root>
    )
}

const Root = styled.div`
    align-items: center;
    background-color: ${COLORS.inputBackground};
    border-radius: 4px;
    display: flex;
    padding: 24px;

    p {
        flex-grow: 1;
        margin: 0 56px 0 0;
    }
`

const InputWrap = styled.div`
    flex: 1;
    min-width: 120px;
    position: relative;

    ${TextField} {
        padding-right: 48px;
    }
`

const Appendix = styled.div`
    align-items: center;
    border-left: 1px solid #efefef;
    color: #525252;
    display: flex;
    height: 38px;
    justify-content: center;
    line-height: normal;
    pointer-events: none;
    position: absolute;
    right: 1px;
    top: 1px;
    width: 36px;
`
