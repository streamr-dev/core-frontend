import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import Checkbox from '~/shared/components/Checkbox'
import Text from '~/shared/components/Ui//Text'
import Label from '~/shared/components/Ui//Label'
import Errors, { MarketplaceTheme } from '~/shared/components/Ui//Errors'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'
import useValidation from '../ProductController/useValidation'

type Props = {
    className?: string
    disabled?: boolean
}

const Section = styled.div`
    background: none;
    max-width: 678px;

    h2 {
        font-size: 34px;
        line-height: 34px;
        color: black;
        margin-bottom: 30px;
        font-weight: 400;
    }

    p {
        color: black;
        font-size: 16px;
    }
`

const DetailsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
`

const StyledCheckbox = styled(Checkbox)`
    width: 24px !important;
    height: 24px !important;
`

const terms = {
    redistribution: 'Redistribution',
    commercialUse: 'Commercial use',
    reselling: 'Reselling',
    storage: 'Storage',
}

const UnstyledTermCheckbox = ({
    id,
    product,
    updateTermsOfUse,
    disabled,
    ...props
}: {
    id: string
    product: any
    updateTermsOfUse: any
    disabled: boolean
}) => (
    <CheckboxLabel {...props} htmlFor={id}>
        <StyledCheckbox
            id={id}
            name={id}
            value={product.termsOfUse[id]}
            onChange={(e) => {
                updateTermsOfUse({
                    ...product.termsOfUse,
                    [id]: e.target.checked,
                })
            }}
            disabled={disabled}
        />
        <span>{terms[id]}</span>
    </CheckboxLabel>
)

const TermCheckbox = styled(UnstyledTermCheckbox)`
    align-items: center;
    display: flex;
    margin: 0;
`

const CheckboxContainer = styled.div`
    margin: 40px 0;
    background: #f1f1f1;
    border-radius: 4px;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;

    ${TermCheckbox} + ${TermCheckbox} {
        margin-left: 1rem;
    }
`

const CheckboxLabel = styled.label`
    color: black;
`

export const TermsOfUse: FunctionComponent<Props> = ({ className, disabled }: Props) => {
    const { state: project } = useContext(ProjectStateContext)
    const { updateTermsOfUse } = useEditableProjectActions()
    const { isValid, message } = useValidation('termsOfUse')

    return (
        <Section id="terms" className={className}>
            <h2>Set terms of use</h2>
            <p>
                Indicate the terms of use you prefer, either simply, by checking the
                appropriate boxes below to show usage types are permitted, or optionally,
                give more detail by providing a link to your own terms of use document.
            </p>
            <CheckboxContainer>
                <TermCheckbox
                    id="redistribution"
                    product={project}
                    updateTermsOfUse={updateTermsOfUse}
                    disabled={!!disabled}
                />
                <TermCheckbox
                    id="commercialUse"
                    product={project}
                    updateTermsOfUse={updateTermsOfUse}
                    disabled={!!disabled}
                />
                <TermCheckbox
                    id="reselling"
                    product={project}
                    updateTermsOfUse={updateTermsOfUse}
                    disabled={!!disabled}
                />
                <TermCheckbox
                    id="storage"
                    product={project}
                    updateTermsOfUse={updateTermsOfUse}
                    disabled={!!disabled}
                />
            </CheckboxContainer>
            <DetailsContainer>
                <div>
                    <Label>Link to detailed terms</Label>
                    <Text
                        defaultValue={project?.termsOfUse?.termsUrl}
                        onCommit={(text) => {
                            updateTermsOfUse({
                                ...project.termsOfUse,
                                termsUrl: text,
                            })
                        }}
                        placeholder="Add a URL here"
                        disabled={!!disabled}
                        selectAllOnFocus
                        smartCommit
                        invalid={!isValid}
                    />
                    {!isValid && <Errors theme={MarketplaceTheme}>{message}</Errors>}
                </div>
                <div>
                    <Label>Display name for link</Label>
                    <Text
                        defaultValue={project?.termsOfUse?.termsName}
                        onCommit={(text) => {
                            updateTermsOfUse({
                                ...project.termsOfUse,
                                termsName: text,
                            })
                        }}
                        placeholder="Add a display name"
                        disabled={!!disabled}
                        selectAllOnFocus
                        smartCommit
                    />
                </div>
            </DetailsContainer>
        </Section>
    )
}
