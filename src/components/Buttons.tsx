import React, { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '~/components/Button'

interface ButtonAction {
    title: string
    onClick?: () => void | Promise<void>
    linkTo?: string
    href?: string
    kind?: ComponentProps<typeof Button>['kind']
    disabled?: boolean
    visible?: boolean
    outline?: boolean
    spinner?: boolean
    className?: string
    type?: string
}

export type ButtonActions = Record<string, ButtonAction>

interface Props {
    actions?: ButtonActions
    className?: string
}

const DefaultActions = {}

export function Buttons({ actions = DefaultActions, className }: Props) {
    return (
        <Root className={className}>
            {actions &&
                Object.keys(actions)
                    .filter((key: string) => actions && actions[key].visible !== false)
                    .map((key: string) => {
                        const {
                            title,
                            onClick,
                            linkTo,
                            href,
                            kind,
                            disabled,
                            outline,
                            spinner,
                            className: cn,
                            type,
                        } = (actions && actions[key]) || {}

                        const Tag = kind === 'link' ? Button : ButtonWithMinWidth

                        return (
                            <Tag
                                key={key}
                                as={linkTo != null ? Link : href != null ? 'a' : 'button'}
                                to={linkTo}
                                href={href}
                                onClick={onClick}
                                disabled={disabled}
                                kind={kind}
                                outline={outline}
                                waiting={spinner}
                                type={type}
                                className={cn}
                            >
                                {title}
                            </Tag>
                        )
                    })}
        </Root>
    )
}

const Root = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;

    /* prevents border rendering glitches in chrome */
    transform: translate3d(0, 0, 0);

    :empty {
        display: none;
    }

    > * {
        padding-right: 15px;
        padding-left: 15px;
    }

    > * + * {
        margin-left: 1rem;
    }
`

const ButtonWithMinWidth = styled(Button)`
    min-width: 7rem;
`
