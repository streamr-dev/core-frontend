import React from 'react'
import styled from 'styled-components'

const NormalTheme = {
    color: '#525252',
    background: 'transparent',
    hoverBackground: '#F8F8F8',
    fontSize: 16,
}

const ErrorTheme = {
    color: '#D90C25',
    background: '#FDF3F4',
    hoverBackground: '#FDF3F4',
    fontSize: 14,
}

const SignInMethodTitle = styled.div``

const SignInMethodIcon = styled.div``

const SignInMethodButton = styled.button`
    margin: auto 16px;
    padding: 0 16px;
    height: 56px;
    border-radius: 4px;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    appearance: none;
    border: 0;
    outline: none;
    text-align: left;
    transition: opacity 0.3s ease;

    background-color: ${({ theme }) => theme.background};

    :not(:disabled):hover {
        background-color: ${({ theme }) => theme.hoverBackground};
    }

    :disabled {
        cursor: not-allowed;
    }

    :not([data-active-method=true]):disabled {
        opacity: 0.5;
    }

    :focus {
        outline: none;
    }

    ${SignInMethodTitle} {
        flex-grow: 1;
        color: ${({ theme }) => theme.color};
        font-size: ${({ theme }) => theme.fontSize}px;
    }

    ${SignInMethodTitle} + ${SignInMethodIcon} {
        margin-left: 16px;
    }
`

const SignInMethod = ({ theme, ...props }) => (
    <SignInMethodButton
        type="button"
        theme={theme || NormalTheme}
        {...props}
    />
)

Object.assign(SignInMethod, {
    Title: SignInMethodTitle,
    Icon: SignInMethodIcon,
    themes: {
        Normal: NormalTheme,
        Error: ErrorTheme,
    },
})

export default SignInMethod
