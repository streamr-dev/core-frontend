import React from 'react'
import styled from 'styled-components'
import { SimpleDropdown, SimpleListDropdownMenu } from '~/components/SimpleDropdown'
import NetworkIcon from '~/shared/components/NetworkIcon'
import SvgIcon from '~/shared/components/SvgIcon'
import { useAvailableChains, useChainStore, useCurrentChain } from '~/shared/stores/chain'
import { Chain } from '~/types'
import { COLORS, LAPTOP } from '~/shared/utils/styled'
import { DropdownMenuItem } from '~/components/DropdownMenuItem'

type MenuItemProps = {
    chain: Chain
    isSelected: boolean
}

const MenuItem = ({ chain, isSelected }: MenuItemProps) => (
    <MenuItemContainer>
        <NetworkIcon chainId={chain.id} />
        <div>{chain.name}</div>
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
            <ul>
                {chains.map((c) => (
                    <DropdownMenuItem
                        key={c.id}
                        type="button"
                        onClick={() => {
                            setSelectedChain(c.id)
                            toggle(false)
                        }}
                    >
                        <MenuItem chain={c} isSelected={c.id === selectedChain.id} />
                    </DropdownMenuItem>
                ))}
            </ul>
        </MenuContainer>
    )
}

export const ChainSelector = (props) => {
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
                {...props}
            >
                {(toggle, isOpen) => (
                    <Toggle $isOpen={isOpen} onClick={() => toggle((v) => !v)}>
                        <NetworkIcon chainId={selectedChain.id} />
                        <div>{selectedChain.name}</div>
                        <Caret name="caretUp" $isOpen={isOpen} />
                    </Toggle>
                )}
            </SimpleDropdown>
        </>
    )
}

const MenuContainer = styled(SimpleListDropdownMenu)`
    color: ${COLORS.primaryLight};
    font-size: 16px;
    font-weight: 500;
`

const MenuItemContainer = styled.div`
    display: grid;
    grid-template-columns: 24px auto auto;
    gap: 8px;
    align-items: center;
    line-height: 24px;
    cursor: pointer;
    white-space: nowrap;

    svg {
        color: ${COLORS.primaryLight};
        height: 13px;
        width: 13px;
    }
`

const Toggle = styled.div<{ $isOpen: boolean }>`
    display: grid;
    grid-template-columns: 24px auto auto;
    line-height: 24px;
    align-items: center;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    background: ${({ $isOpen }) => ($isOpen ? '#f3f3f3' : '#fff')};
    cursor: pointer;
    gap: 0px;
    height: 32px;
    padding: 4px 8px;
    align-items: center;
    margin-left: 16px;
    margin-right: 16px;
    width: fit-content;
    color: ${COLORS.primary};
    font-size: 14px;
    font-weight: 500;

    img {
        width: 20px;
        height: 20px;
    }

    div:nth-child(2) {
        display: none;
    }

    @media ${LAPTOP} {
        height: 40px;
        margin-left: 0px;
        margin-right: 24px;
        padding: 8px 12px;
        gap: 8px;

        img {
            width: 24px;
            height: 24px;
        }

        div:nth-child(2) {
            display: initial;
        }
    }
`

const Caret = styled(SvgIcon)<{ $isOpen: boolean }>`
    width: 10px !important;
    transition: transform 200ms ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
`
