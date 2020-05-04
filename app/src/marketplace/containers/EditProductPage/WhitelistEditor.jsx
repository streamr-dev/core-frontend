// @flow

import React from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import Toggle from '$shared/components/Toggle'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import useModal from '$shared/hooks/useModal'
import useCopy from '$shared/hooks/useCopy'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'

import useWhitelist from './useWhitelist'

const Container = styled.div`
    background: #fdfdfd;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 14px;
`

const Rows = styled.div`
    height: 279px;
    overflow: auto;
`

const TableRow = styled.span`
    display: grid;
    grid-template-columns: auto 90px 90px;
`

const TableColumnBase = styled.span`
    display: flex;
    justify-content: ${(props) => (props.center ? 'center' : 'unset')};
    align-items: center;
    height: 56px;
    padding: 0 24px;

    * {
        opacity: ${(props) => (props.disabled ? '0.5' : '1.0')};
    }

    &:not(:last-child) {
        border-right: 1px solid #ebebeb;
    }
`

const TableHeader = styled(TableColumnBase)`
    font-weight: 500;
    letter-spacing: 0px;
    border-bottom: 1px solid #ebebeb;
`

const TableColumn = styled(TableColumnBase)`
    border-bottom: 1px solid #ebebeb;

    ${TableRow}:hover & {
        background-color: #f8f8f8;
    }
`

const StyledDropdownActions = styled(DropdownActions)`
    visibility: hidden;

    ${TableRow}:hover & {
        visibility: ${(props) => (props.disabled ? 'hidden' : 'visible')};
    }
`

const Controls = styled.div`
    height: 72px;
    padding: 0 16px 0 24px;
    border-top: 1px solid #ebebeb;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 16px;
    align-items: center;
`

const StyledToggle = styled(Toggle)`
    display: flex;
    align-items: center;

    * {
        margin-bottom: 0;
    }
`

const Status = styled.span`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${(props) => {
        if (props.disabled) {
            return '#cdcdcd'
        } else if (props.status === 'added') {
            return '#ffbc00'
        } else if (props.status === 'removed') {
            return '#adadad'
        }
        return '#2ac437'
    }};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

    &::after {
        display: inline-block;
        content: attr(data-tooltip);
        visibility: hidden;
        opacity: 0;
        transition: 0s all;
        position: relative;
        background-color: #323232;
        border-radius: 2px;
        color: white;
        font-size: 12px;
        line-height: 16px;
        top: 26px;
        left: 50%;
        transform: translateX(-50%);
        padding: 2px 6px;
    }

    &:hover {
        &::after {
            transition-delay: 0.5s;
            visibility: visible;
            opacity: 1;
        }
    }
`

const Label = styled.label`
    margin-bottom: 0;
`

type Props = {
    className?: string,
    enabled: boolean,
    items: Array<WhitelistItem>,
    onEnableChanged: (boolean) => void,
    addDialog: any,
    removeDialog: any,
    copy: (string) => void,
}

export const WhitelistEditorComponent = ({
    className,
    enabled,
    items,
    onEnableChanged,
    addDialog,
    removeDialog,
    copy,
}: Props) => (
    <Container className={className}>
        <TableRow>
            <TableHeader>{I18n.t('editProductPage.whitelist.header.address')}</TableHeader>
            <TableHeader>{I18n.t('editProductPage.whitelist.header.status')}</TableHeader>
            <TableHeader />
        </TableRow>
        <Rows>
            {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow key={index}>
                    <TableColumn disabled={!enabled}>
                        <span>{item.address}</span>
                    </TableColumn>
                    <TableColumn disabled={!enabled} center>
                        <Status
                            status={item.status}
                            disabled={!enabled}
                            data-tooltip={I18n.t(`editProductPage.whitelist.status.${item.status}`)}
                        />
                    </TableColumn>
                    <TableColumn disabled={!enabled} center>
                        <StyledDropdownActions
                            title={<Meatball alt="Select" />}
                            noCaret
                            disabled={!enabled}
                        >
                            <DropdownActions.Item onClick={() => copy(item.address)}>
                                {I18n.t('editProductPage.whitelist.copy')}
                            </DropdownActions.Item>
                            {item.status !== 'removed' && (
                                <DropdownActions.Item onClick={() => removeDialog.open({
                                    address: item.address,
                                })}
                                >
                                    {I18n.t('editProductPage.whitelist.remove')}
                                </DropdownActions.Item>
                            )}
                        </StyledDropdownActions>
                    </TableColumn>
                </TableRow>
            ))}
        </Rows>
        <Controls>
            <Label htmlFor="whitelist">{I18n.t('editProductPage.whitelist.enable')}</Label>
            <StyledToggle
                id="whitelist"
                value={enabled}
                onChange={(val) => {
                    onEnableChanged(val)
                }}
            />
            <Button
                kind="secondary"
                size="normal"
                disabled={!enabled}
                onClick={() => {
                    addDialog.open()
                }}
            >
                {I18n.t('editProductPage.whitelist.add')}
            </Button>
        </Controls>
    </Container>
)

export const WhitelistEditor = () => {
    const { isEnabled, setEnabled, items } = useWhitelist()
    const { api: addDialog } = useModal('addWhitelistAddress')
    const { api: removeDialog } = useModal('removeWhitelistAddress')
    const { copy } = useCopy()

    // TODO: Email address must be provided when we enable whitelist

    return (
        <WhitelistEditorComponent
            items={items}
            enabled={isEnabled}
            onEnableChanged={(value) => setEnabled(value)}
            addDialog={addDialog}
            removeDialog={removeDialog}
            copy={copy}
        />
    )
}

export default WhitelistEditor
