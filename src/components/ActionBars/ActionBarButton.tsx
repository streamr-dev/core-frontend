import React, { ButtonHTMLAttributes, ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'
import { ExternalLinkIcon } from '~/icons'
import { Tooltip } from '~/components/Tooltip'
import { getBlockExplorerUrl } from '~/getters'
import { truncate } from '~/shared/utils/text'
import { CopyButton } from '~/components/CopyButton'
import { useCurrentChainId } from '~/utils/chains'

export const ActionBarButtonBody = styled.div<{ $background?: string; $color?: string }>`
    align-items: center;
    border-radius: 8px;
    display: grid;
    font-size: 14px;
    gap: 12px;
    grid-template-columns: repeat(
        ${({ children }) => React.Children.toArray(children).filter(Boolean).length},
        max-content
    );
    height: 40px;
    padding: 0 12px;
    transition: 250ms background;

    ${({ $background = COLORS.secondary, $color = COLORS.primary }) => css`
        background: ${$background};
        color: ${$color};
    `}
`

const ActionBarButtonRoot = styled.button<{ $active?: boolean }>`
    appearance: none;
    background: none;
    border: 0;
    display: block;
    padding: 0;

    :hover ${ActionBarButtonBody} {
        background: ${COLORS.secondaryLight};
    }

    :active ${ActionBarButtonBody} {
        background: ${COLORS.secondaryHover};
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.03);
    }

    ${({ $active = false }) =>
        $active &&
        css`
            :hover ${ActionBarButtonBody}, ${ActionBarButtonBody} {
                background: ${COLORS.secondaryHover};
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.01);
            }
        `}
`

interface ActionBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
}

export function ActionBarButton({
    active = false,
    children,
    ...props
}: ActionBarButtonProps) {
    return (
        <ActionBarButtonRoot type="button" {...props} $active={active}>
            <ActionBarButtonBody>{children}</ActionBarButtonBody>
        </ActionBarButtonRoot>
    )
}

export const ActionBarButtonInnerBody = styled.div`
    ${({ children }) => {
        const count = React.Children.count(children)

        return (
            count > 1 &&
            css`
                align-items: center;
                display: grid;
                gap: 6px;
                grid-template-columns: repeat(${count}, max-content);
            `
        )
    }}
`

function getActionBarButtonCaretAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'caretDown',
    }
}

export const ActionBarButtonCaret = styled(SvgIcon).attrs(getActionBarButtonCaretAttrs)<{
    $invert?: boolean
}>`
    color: ${COLORS.primaryDisabled};
    width: 12px;
    transition: 150ms transform;

    ${({ $invert = false }) =>
        $invert &&
        css`
            transform: rotate(180deg);
        `}
`

export function ActionBarWalletDisplay({
    address,
    label = 'Wallet',
}: {
    address: string
    label?: string
}) {
    const chainId = useCurrentChainId()

    const blockExplorerUrl = getBlockExplorerUrl(chainId)

    return (
        <ActionBarButtonBody>
            <div>
                {label}: <strong>{truncate(address)}</strong>
            </div>
            <Tooltip content="Copy address">
                <CopyButton value={address} />
            </Tooltip>
            {blockExplorerUrl && (
                <Tooltip content="View on explorer">
                    <a
                        href={`${blockExplorerUrl}/address/${address}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ExternalLinkIcon />
                    </a>
                </Tooltip>
            )}
        </ActionBarButtonBody>
    )
}
