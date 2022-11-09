import React from 'react'
import styled from 'styled-components'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import SelectField from '$mp/components/SelectField'

type Props = {
    disabled?: boolean
}

const Section = styled.section`
    background: none;
`

const Container = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
`
const Item = styled.div`
    background: #ffffff;
    border-radius: 4px;
    line-height: 64px;
`
const Radio = styled.input`
    width: 16px;
    justify-self: center;
    align-self: center;
`
const RadioContainer = styled.label`
    width: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 48px auto 48px;
`
const ExistingDataUnionContainer = styled.div`
    display: grid;
    grid-template-rows: auto auto;
    margin: 0 24px 24px 48px;
`

const DataUnionDeployment = ({ disabled }: Props) => {
    const { state: product } = useEditableState()

    const options = [
        {
            label: 'Du1',
            value: 'Du1',
        }
    ]

    return (
        <Section id="deployment">
            <div>
                <h1>Deployment</h1>
                <p>You can deploy a new Data Union smart contract, or connect an existing one to eventually publish it on the Marketplace.</p>

                <Container>
                    <Item>
                        <RadioContainer htmlFor="new">
                            <Radio
                                id="new"
                                type="radio"
                                name="deploy"
                                checked={true}
                                onChange={() => {
                                    console.log('changed')
                                }}
                                disabled={disabled}
                            />
                            Deploy a new Data Union
                        </RadioContainer>
                    </Item>
                    <Item>
                        <RadioContainer htmlFor="existing">
                            <Radio
                                id="existing"
                                type="radio"
                                name="deploy"
                                checked={false}
                                onChange={() => {
                                    console.log('changed')
                                }}
                                disabled={disabled}
                            />
                            Connect an existing Data Union
                        </RadioContainer>
                        <ExistingDataUnionContainer>
                            <SelectField
                                placeholder="Select"
                                options={options}
                                value={null}
                                onChange={({ value: nextValue }) => console.log(nextValue)}
                                disabled={false}
                            />
                        </ExistingDataUnionContainer>
                    </Item>
                </Container>
            </div>
        </Section>
    )
}

export default DataUnionDeployment
