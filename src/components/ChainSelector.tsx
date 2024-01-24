import React from 'react'
import styled from 'styled-components'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import NetworkIcon from '~/shared/components/NetworkIcon'
import SvgIcon from '~/shared/components/SvgIcon'
import { useAvailableChains, useChainStore, useCurrentChain } from '~/shared/stores/chain'
import { Chain } from '~/types'
import { TABLET } from '~/shared/utils/styled'

type MenuItemProps = {
    chain: Chain
    onClick: () => void
    isSelected: boolean
}

const MenuItem = ({ chain, onClick, isSelected }: MenuItemProps) => (
    <MenuItemContainer>
        <NetworkIcon chainId={chain.id} /> <a onClick={onClick}>{chain.name}</a>{' '}
        {isSelected ? <SvgIcon name="tick" /> : <div />}
    </MenuItemContainer>
)

type MenuProps = {
    chains: Chain[]
    selectedChain: Chain
    toggle: (value: boolean) => void
}

const Menu = ({ chains, selectedChain, toggle }: MenuProps) => {
    const setSelectedChain = useChainStore((state) => state.setSelectedChain)

    return (
        <MenuContainer>
            {chains.map((c) => (
                <MenuItem
                    key={c.id}
                    chain={c}
                    onClick={() => {
                        setSelectedChain(c.id)
                        toggle(false)
                    }}
                    isSelected={c.id === selectedChain.id}
                />
            ))}
        </MenuContainer>
    )
}

export const ChainSelector = () => {
    const availableChains = useAvailableChains()
    const selectedChain = useCurrentChain()

    return (
        <>
            <SimpleDropdown
                menu={(toggle) => (
                    <Menu
                        chains={availableChains}
                        selectedChain={selectedChain}
                        toggle={toggle}
                    />
                )}
            >
                {(toggle, isOpen) => (
                    <Toggle $isOpen={isOpen} onClick={() => toggle((v) => !v)}>
                        <MenuItemContainer>
                            <NetworkIcon chainId={selectedChain.id} />{' '}
                            {selectedChain.name}
                            <Caret name="caretUp" $isOpen={isOpen} />
                        </MenuItemContainer>
                    </Toggle>
                )}
            </SimpleDropdown>
        </>
    )
}

const MenuContainer = styled.div`
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    padding: 16px 24px;
`

const MenuItemContainer = styled.div`
    display: grid;
    grid-template-columns: 24px 0 auto;
    gap: 8px;
    align-items: center;
    line-height: 24px;
    cursor: pointer;
    white-space: nowrap;

    > svg {
        height: 24px;
        width: 24px;
    }

    @media ${TABLET} {
        grid-template-columns: 24px auto auto;
    }
`

const Toggle = styled.div<{ $isOpen: boolean }>`
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    background: ${({ $isOpen }) => ($isOpen ? '#f3f3f3' : '#fff')};
    cursor: pointer;
    gap: 8px;
    height: 40px;
    padding: 8px 12px;
    align-items: center;
    margin-left: 16px;
    margin-right: 0;
    width: fit-content;

    @media ${TABLET} {
        margin-left: 0px;
        margin-right: 24px;
    }
`

const Caret = styled(SvgIcon)<{ $isOpen: boolean }>`
    width: 10px !important;
    transition: transform 200ms ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
`
