import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'
import InfoIcon from '@atlaskit/icon/glyph/info'
import ErrorIcon from '@atlaskit/icon/glyph/error'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { MEDIUM } from '../utils/styled'
import Spinner from '../components/Spinner'
import AbstractToast from './AbstractToast'

export enum ToastType {
    Info = 'info',
    Processing = 'processing',
    Success = 'success',
    Warning = 'warn',
}

interface Props {
    cancelLabel?: string
    desc?: ReactNode
    okLabel?: string
    onReject?: (reason?: any) => void
    onResolve?: () => void
    title?: string
    type?: ToastType
    canSubmit?: boolean
    autoCloseAfter?: number | boolean
}

const defaultAutoCloseAfter = 3

export default function Toast({
    type = ToastType.Info,
    title = 'внимание!',
    desc,
    okLabel,
    cancelLabel,
    onResolve,
    onReject,
    canSubmit = true,
    autoCloseAfter: autoCloseAfterProp = true,
}: Props) {
    const autoCloseAfter =
        type !== ToastType.Processing && okLabel == null && cancelLabel == null
            ? autoCloseAfterProp === true
                ? defaultAutoCloseAfter
                : autoCloseAfterProp
            : false

    useEffect(() => {
        if (autoCloseAfter === false) {
            return () => void 0
        }

        const timeoutId = setTimeout(() => void onReject?.(), autoCloseAfter * 1000)

        return () => void clearTimeout(timeoutId)
    }, [autoCloseAfter, onReject])

    return (
        <AbstractToast>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()

                    if (canSubmit) {
                        onResolve?.()
                    }
                }}
            >
                <>
                    {type === ToastType.Success && (
                        <IconWrap $color="#0EAC1B">
                            <CheckCircleIcon label="Success" />
                        </IconWrap>
                    )}
                    {type === ToastType.Info && (
                        <IconWrap $color="#6240AF">
                            <InfoIcon label="Info" />
                        </IconWrap>
                    )}
                    {type === ToastType.Warning && (
                        <IconWrap $color="#FF5C00">
                            <ErrorIcon label="Error" />
                        </IconWrap>
                    )}
                    {type === ToastType.Processing && (
                        <IconWrap>
                            <Spinner color="blue" />
                        </IconWrap>
                    )}
                </>
                <Body>
                    <h4>{title}</h4>
                    {typeof desc === 'string' ? <p>{desc}</p> : desc}
                    {(okLabel || cancelLabel) != null && (
                        <Buttons>
                            {okLabel != null && (
                                <Button type="submit" disabled={!canSubmit}>
                                    {okLabel}
                                </Button>
                            )}
                            {okLabel != null && cancelLabel != null && <Dot />}
                            {cancelLabel != null && (
                                <Button type="button" onClick={() => void onReject?.()}>
                                    {cancelLabel}
                                </Button>
                            )}
                        </Buttons>
                    )}
                </Body>
                {type !== ToastType.Processing && (
                    <CloseButton onClick={() => void onReject?.()} type="button">
                        <CrossIcon label="Dismiss" size="small" />
                    </CloseButton>
                )}
            </Form>
        </AbstractToast>
    )
}

const CloseButton = styled.button`
    align-items: center;
    appearance: none;
    color: #525252;
    display: flex;
    flex-shrink: 0;
    height: 24px;
    justify-content: center;
    margin-left: 16px;
    width: 24px;
    padding: 0;
    outline: 0;
    border: 0;
    background: none;
`

const Dot = styled.div`
    background: #525252;
    height: 3px;
    margin-left: 8px;
    margin-right: 8px;
    width: 3px;
`

const Form = styled.form`
    align-items: start;
    display: flex;
    max-width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 400px;
`

const IconWrap = styled.div<{ $color?: string }>`
    height: 24px;
    width: 24px;
    position: relative;
    display: flex;
    items-center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 16px;
    color: ${({ $color = 'inherit' }) => $color};
`

const Body = styled.div`
    flex-grow: 1;
    min-width: 0;
    padding: 3px 0;
    font-size: 14px;

    p,
    h4,
    ul,
    ol {
        font-size: inherit;
        overflow-wrap: break-word;
    }

    h4 {
        margin: 0;
        line-height: normal;
    }

    p,
    ul,
    ol {
        margin: 8px 0 0;
        line-height: 20px;
        padding: 0;
    }

    h4 {
        font-weight: ${MEDIUM};
    }

    ol {
        list-style-position: inside;
    }
`

const Buttons = styled.div`
    align-items: center;
    display: flex;
    line-height: normal;
    margin-top: 8px;
`

const Button = styled.button`
    background: none;
    border: 0;
    color: #0324ff;
    display: block;
    font-size: 14px;
    font-weight: ${MEDIUM};
    outline: 0;
    padding: 0;

    :hover {
        color: #000d67;
    }

    :disabled {
        color: inherit;
        opacity: 0.5;
    }
`
