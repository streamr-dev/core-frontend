// @flow

import React from 'react'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import { withKnobs, select, text, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import BN from 'bignumber.js'

import { transactionStates, ProgrammingLanguages } from '$shared/utils/constants'
import { actionsTypes } from '$mp/containers/EditProductPage/publishQueue'

import croppedImage from '$mp/assets/product_standard.png'

// marketplace
import CompleteContractProductPublishDialog from '$mp/components/Modal/CompleteContractProductPublishDialog'
import CompleteContractProductUnpublishDialog from '$mp/components/Modal/CompleteContractProductUnpublishDialog'
import CompletePublishTransaction from '$mp/components/Modal/CompletePublishTransaction'
import CompleteUnpublishDialog from '$mp/components/Modal/CompleteUnpublishDialog'
import ConfirmPublishTransaction from '$mp/components/Modal/ConfirmPublishTransaction'
import ConfirmSaveDialog from '$mp/components/Modal/ConfirmSaveDialog'
import GuidedDeployCommunityDialog from '$mp/components/Modal/GuidedDeployCommunityDialog'
import ConfirmDeployCommunityDialog from '$mp/components/Modal/ConfirmDeployCommunityDialog'
import DeployingCommunityDialog from '$mp/components/Modal/DeployingCommunityDialog'
import GetDataTokensDialog from '$mp/components/Modal/GetDataTokensDialog'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import InsufficientDataDialog from '$mp/components/Modal/InsufficientDataDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import ChooseAccessPeriodDialog from '$mp/components/Modal/ChooseAccessPeriodDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import SaveContractProductDialog from '$mp/components/Modal/SaveContractProductDialog'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import MpUnlockWalletDialog from '$mp/components/Modal/UnlockWalletDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import CropImageModal from '$mp/components/Modal/CropImageModal'

// userpages
import ConfirmCsvImportDialog from '$userpages/components/StreamPage/ConfirmCsvImportDialog'
import SnippetDialog from '$userpages/components/SnippetDialog'
import AvatarUploadDialog from '$userpages/components/Avatar/AvatarUploadDialog'
import CropAvatarDialog from '$userpages/components/Avatar/CropAvatarDialog'
import { ChangePasswordDialog } from '$userpages/components/ProfilePage/ChangePassword'
import {
    SignatureRequestDialog,
    ErrorDialog as SignatureRequestErrorDialog,
    SuccessDialog as SignatureRequestSuccessDialog,
} from '$userpages/components/ProfilePage/IdentityHandler/IdentityChallengeDialog'
import DuplicateIdentityDialog from '$userpages/components/ProfilePage/IdentityHandler/IdentityChallengeDialog/DuplicateIdentityDialog'
import IdentityNameDialog from '$userpages/components/ProfilePage/IdentityHandler/IdentityNameDialog'

// shared
import ConfirmDialog from '$shared/components/ConfirmDialog'
import SharedUnlockWalletDialog from '$shared/components/Web3ErrorDialog/UnlockWalletDialog'
import InstallMetaMaskDialog from '$shared/components/Web3ErrorDialog/Web3NotDetectedDialog/InstallMetaMaskDialog'
import InstallMobileApplicationDialog from '$shared/components/Web3ErrorDialog/Web3NotDetectedDialog/InstallMobileApplicationDialog'
import InstallSupportedBrowserDialog from '$shared/components/Web3ErrorDialog/Web3NotDetectedDialog/InstallSupportedBrowserDialog'

const story = (name) => storiesOf(`Modal/${name}`, module)
    .addDecorator(StoryRouter())
    .addDecorator(withKnobs)
    .addDecorator(styles({
        color: '#323232',
        padding: '5rem',
        background: '#F8F8F8',
    }))
    .addDecorator((storyFn) => (
        <div>
            <div id="content">{storyFn()}</div>
            <div id="modal-root" />
        </div>
    ))

story('Product Editor/CompleteContractProductPublishDialog')
    .add('started', () => (
        <CompleteContractProductPublishDialog
            publishState={transactionStates.STARTED}
            onCancel={action('onCancel')}
        />
    ))
    .add('pending', () => (
        <CompleteContractProductPublishDialog
            publishState={transactionStates.PENDING}
            onCancel={action('onCancel')}
        />
    ))
    .add('confirmed', () => (
        <CompleteContractProductPublishDialog
            publishState={transactionStates.CONFIRMED}
            onCancel={action('onCancel')}
        />
    ))
    .add('error', () => (
        <CompleteContractProductPublishDialog
            publishState={transactionStates.FAILED}
            onCancel={action('onCancel')}
        />
    ))

story('Product Editor/CompleteContractProductUnpublishDialog')
    .add('started', () => (
        <CompleteContractProductUnpublishDialog
            publishState={transactionStates.STARTED}
            onCancel={action('onCancel')}
        />
    ))
    .add('pending', () => (
        <CompleteContractProductUnpublishDialog
            publishState={transactionStates.PENDING}
            onCancel={action('onCancel')}
        />
    ))
    .add('confirmed', () => (
        <CompleteContractProductUnpublishDialog
            publishState={transactionStates.CONFIRMED}
            onCancel={action('onCancel')}
        />
    ))
    .add('error', () => (
        <CompleteContractProductUnpublishDialog
            publishState={transactionStates.FAILED}
            onCancel={action('onCancel')}
        />
    ))

type CompletePublishControllerProps = {
    isUnpublish?: boolean,
}

const CompletePublishController = ({ isUnpublish = false }: CompletePublishControllerProps) => {
    const options = [
        transactionStates.PENDING,
        transactionStates.CONFIRMED,
        transactionStates.FAILED,
    ]

    let statuses = {}

    if (isUnpublish) {
        const unpublishFreeStatus = select('Unpublish free', options, transactionStates.PENDING)
        const undeployPaidStatus = select('Undeploy paid', options, transactionStates.PENDING)

        statuses = {
            [actionsTypes.UNPUBLISH_FREE]: unpublishFreeStatus,
            [actionsTypes.UNDEPLOY_CONTRACT_PRODUCT]: undeployPaidStatus,
        }
    } else {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.PENDING)
        const updateContractStatus = select('Edit product price', options, transactionStates.PENDING)
        const createContractStatus = select('Create contract product', options, transactionStates.PENDING)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.PENDING)
        const publishFreeStatus = select('Publish free', options, transactionStates.PENDING)

        statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
        }
    }

    return (
        <CompletePublishTransaction
            isUnpublish={isUnpublish}
            onCancel={action('cancel')}
            status={statuses}
        />
    )
}

story('Product Editor/CompletePublishTransaction')
    .add('Publish', () => (
        <CompletePublishController />
    ))
    .add('Unpublish', () => (
        <CompletePublishController isUnpublish />
    ))

story('Product Editor/CompleteUnpublishDialog')
    .add('started', () => (
        <CompleteUnpublishDialog
            publishState={transactionStates.STARTED}
            onCancel={action('onCancel')}
        />
    ))
    .add('confirmed', () => (
        <CompleteUnpublishDialog
            publishState={transactionStates.CONFIRMED}
            onCancel={action('onCancel')}
        />
    ))
    .add('error', () => (
        <CompleteUnpublishDialog
            publishState={transactionStates.FAILED}
            onCancel={action('onCancel')}
        />
    ))

const publishStory = story('Product Editor/ConfirmPublishTransaction')

Object.keys(actionsTypes).forEach((actionType) => {
    publishStory.add(`publish, started, ${actionsTypes[actionType]}`, () => (
        <ConfirmPublishTransaction
            action={actionsTypes[actionType]}
            isUnpublish={false}
            publishState={transactionStates.STARTED}
            onCancel={action('onCancel')}
        />
    ))
})
Object.keys(actionsTypes).forEach((actionType) => {
    publishStory.add(`unpublish, started, ${actionsTypes[actionType]}`, () => (
        <ConfirmPublishTransaction
            action={actionsTypes[actionType]}
            isUnpublish
            publishState={transactionStates.STARTED}
            onCancel={action('onCancel')}
        />
    ))
})

publishStory.add('publish, pending', () => (
    <ConfirmPublishTransaction
        action={null}
        isUnpublish={false}
        publishState={transactionStates.PENDING}
        onCancel={action('onCancel')}
    />
))

publishStory.add('unpublish, pending', () => (
    <ConfirmPublishTransaction
        action={null}
        isUnpublish
        publishState={transactionStates.PENDING}
        onCancel={action('onCancel')}
    />
))

story('Product Editor/ReadyToPublishDialog')
    .add('default', () => (
        <ReadyToPublishDialog
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
        />
    ))
    .add('waiting', () => (
        <ReadyToPublishDialog
            waiting
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
        />
    ))

story('Product Editor/ReadyToUnpublishDialog')
    .add('default', () => (
        <ReadyToUnpublishDialog
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
        />
    ))

story('Product Editor/SaveContractProductDialog')
    .add('started', () => (
        <SaveContractProductDialog
            transactionState={transactionStates.STARTED}
            onClose={action('onClose')}
        />
    ))
    .add('pending', () => (
        <SaveContractProductDialog
            transactionState={transactionStates.PENDING}
            onClose={action('onClose')}
        />
    ))
    .add('complete', () => (
        <SaveContractProductDialog
            transactionState={transactionStates.CONFIRMED}
            onClose={action('onClose')}
        />
    ))
    .add('error', () => (
        <SaveContractProductDialog
            transactionState={transactionStates.FAILED}
            onClose={action('onClose')}
        />
    ))

story('Product Editor/ConfirmSaveDialog')
    .add('default', () => (
        <ConfirmSaveDialog
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            onSave={action('onSave')}
        />
    ))

story('Product Editor/GuidedDeployCommunityDialog')
    .add('default', () => (
        <GuidedDeployCommunityDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'COMMUNITY',
            }}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
        />
    ))

story('Product Editor/ConfirmDeployCommunityDialog')
    .add('default', () => (
        <ConfirmDeployCommunityDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'COMMUNITY',
            }}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            onShowGuidedDialog={action('onShowGuidedDialog')}
        />
    ))

story('Product Editor/DeployingCommunityDialog')
    .add('default', () => (
        <DeployingCommunityDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'COMMUNITY',
            }}
            estimate={number('Estimate', 360)}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
        />
    ))

story('Marketplace/GetDataTokensDialog')
    .add('default', () => (
        <GetDataTokensDialog
            onCancel={action('onCancel')}
        />
    ))

story('Marketplace/GetCryptoDialog')
    .add('default', () => (
        <GetCryptoDialog
            onCancel={action('onCancel')}
        />
    ))

story('Marketplace/InsufficientDataDialog')
    .add('default', () => (
        <InsufficientDataDialog
            onCancel={action('onCancel')}
        />
    ))

story('Marketplace/NoBalanceDialog')
    .add('eth balance 0', () => (
        <NoBalanceDialog
            requiredEthBalance={BN(0)}
            currentEthBalance={BN(0)}
            requiredDataBalance={BN(0)}
            currentDataBalance={BN(0)}
            onCancel={action('onCancel')}
        />
    ))
    .add('eth balance < required', () => (
        <NoBalanceDialog
            requiredEthBalance={BN(2)}
            currentEthBalance={BN(1)}
            requiredDataBalance={BN(0)}
            currentDataBalance={BN(0)}
            onCancel={action('onCancel')}
        />
    ))
    .add('DATA balance 0', () => (
        <NoBalanceDialog
            requiredEthBalance={BN(2)}
            currentEthBalance={BN(3)}
            requiredDataBalance={BN(0)}
            currentDataBalance={BN(0)}
            onCancel={action('onCancel')}
        />
    ))
    .add('DATA balance < required', () => (
        <NoBalanceDialog
            requiredEthBalance={BN(2)}
            currentEthBalance={BN(3)}
            requiredDataBalance={BN(3)}
            currentDataBalance={BN(2)}
            onCancel={action('onCancel')}
        />
    ))

story('Marketplace/ChooseAccessPeriodDialog')
    .add('default', () => (
        <ChooseAccessPeriodDialog
            dataPerUsd={BN(10)}
            pricePerSecond={BN(1)}
            priceCurrency="DATA"
            onCancel={action('onCancel')}
            onNext={action('onNext')}
        />
    ))

story('Marketplace/PurchaseSummaryDialog')
    .add('default', () => (
        <PurchaseSummaryDialog
            name="Example Product"
            price={BN(123)}
            priceCurrency="DATA"
            time="24"
            timeUnit="hour"
            onCancel={action('onCancel')}
            onPay={action('onPay')}
        />
    ))
    .add('purchaseStarted', () => (
        <PurchaseSummaryDialog
            name="Example Product"
            price={BN(123)}
            priceCurrency="DATA"
            time="24"
            timeUnit="hour"
            onCancel={action('onCancel')}
            onPay={action('onPay')}
            purchaseStarted
        />
    ))

story('Marketplace/SetAllowanceDialog')
    .add('default', () => (
        <SetAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
        />
    ))
    .add('getting allowance', () => (
        <SetAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            gettingAllowance
        />
    ))
    .add('setting allowance', () => (
        <SetAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            settingAllowance
        />
    ))

story('Marketplace/ReplaceAllowanceDialog')
    .add('default', () => (
        <ReplaceAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
        />
    ))
    .add('getting allowance', () => (
        <ReplaceAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            gettingAllowance
        />
    ))
    .add('setting allowance', () => (
        <ReplaceAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            settingAllowance
        />
    ))

story('Marketplace/CompletePurchaseDialog')
    .add('pending', () => (
        <CompletePurchaseDialog
            purchaseState={transactionStates.PENDING}
            onCancel={action('onCancel')}
        />
    ))
    .add('confirmed', () => (
        <CompletePurchaseDialog
            purchaseState={transactionStates.CONFIRMED}
            onCancel={action('onCancel')}
        />
    ))
    .add('confirmed (account not linked)', () => (
        <CompletePurchaseDialog
            purchaseState={transactionStates.CONFIRMED}
            accountLinked={false}
            onCancel={action('onCancel')}
        />
    ))
    .add('error', () => (
        <CompletePurchaseDialog
            purchaseState={transactionStates.FAILED}
            onCancel={action('onCancel')}
        />
    ))

story('Marketplace/UnlockWalletDialog')
    .add('default', () => (
        <MpUnlockWalletDialog
            onClose={action('close')}
            message={text('Dialog text', 'Dialog text')}
        />
    ))

story('Marketplace/ErrorDialog')
    .add('default', () => (
        <ErrorDialog
            onClose={action('close')}
            title={text('Dialog title', 'Dialog title')}
            message={text('Dialog text', 'Dialog text')}
        />
    ))
    .add('waiting', () => (
        <ErrorDialog
            onClose={action('close')}
            title={text('Dialog title', 'Dialog title')}
            message={text('Dialog text', 'Dialog text')}
            waiting
        />
    ))

story('Product Editor/CropImageModal')
    .add('default', () => (
        <CropImageModal
            imageUrl={croppedImage}
            onClose={action('onClose')}
            onSave={action('onSave')}
        />
    ))

story('Streams/ConfirmCsvImportDialog')
    .add('default', () => (
        <ConfirmCsvImportDialog
            streamId="1"
            csvUploadState={null}
            onConfirm={action('onConfirm')}
            onClose={action('onClose')}
            errorMessage=""
        />
    ))

const snippets = {
    [ProgrammingLanguages.JAVASCRIPT]: `const StreamrClient = require('streamr-client')

const streamr = new StreamrClient({
    auth: {
        apiKey: 'YOUR-API-KEY',
    },
})

// Subscribe to a stream
streamr.subscribe({
    stream: 'streamId'
},
(message, metadata) => {
    // Do something with the message here!
    console.log(message)
}`,
    [ProgrammingLanguages.JAVA]: `StreamrClient client = new StreamrClient();
Stream stream = client.getStream("streamId");

Subscription sub = client.subscribe(stream, new MessageHandler() {
    @Override
    void onMessage(Subscription s, StreamMessage message) {
        // Here you can react to the latest message
        System.out.println(message.getPayload().toString());
    }
});`,
}

story('Streams/SnippetDialog')
    .add('default', () => (
        <SnippetDialog
            snippets={snippets}
            onClose={action('onClose')}
        />
    ))

story('Shared/ConfirmDialog')
    .add('default', () => (
        <ConfirmDialog
            title="Dangerous action"
            message="Are you sure?"
            onAccept={action('onAccept')}
            onReject={action('onReject')}
        />
    ))
    .add('centered buttons', () => (
        <ConfirmDialog
            title="Dangerous action"
            message="Are you sure?"
            centerButtons
            onAccept={action('onAccept')}
            onReject={action('onReject')}
        />
    ))
    .add('don\'t show again selection', () => (
        <ConfirmDialog
            title="Dangerous action"
            message="Are you sure?"
            dontShowAgain
            onAccept={action('onAccept')}
            onReject={action('onReject')}
        />
    ))
    .add('customButtons', () => (
        <ConfirmDialog
            title="Dangerous action"
            message="Are you sure?"
            acceptButton={{
                title: 'Delete',
                kind: 'destructive',
            }}
            cancelButton={{
                title: 'Don\'t delete',
                kind: 'secondary',
            }}
            centerButtons
            onAccept={action('onAccept')}
            onReject={action('onReject')}
        />
    ))

story('Shared/UnlockWalletDialog')
    .add('default', () => (
        <SharedUnlockWalletDialog
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
        />
    ))
    .add('waiting', () => (
        <SharedUnlockWalletDialog
            waiting
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
        />
    ))

story('Shared/Web3NotDetectedDialog')
    .add('install Metamask', () => (
        <InstallMetaMaskDialog
            onClose={action('onClose')}
        />
    ))
    .add('install mobile app', () => (
        <InstallMobileApplicationDialog
            onClose={action('onClose')}
        />
    ))
    .add('install supported browser', () => (
        <InstallSupportedBrowserDialog
            onClose={action('onClose')}
        />
    ))

story('Profile/AvatarUploadDialog')
    .add('default', () => (
        <AvatarUploadDialog
            originalImage=""
            onClose={action('onClose')}
            onSave={action('onSave')}
        />
    ))
    .add('with original image', () => (
        <AvatarUploadDialog
            originalImage="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
            onClose={action('onClose')}
            onSave={action('onSave')}
        />
    ))

story('Profile/CropAvatarDialog')
    .add('default', () => {
        const cropAndSave = action('cropAndSave')
        const saveAction = (...args) => new Promise((resolve) => {
            cropAndSave(...args)
            resolve()
        })

        return (
            <CropAvatarDialog
                originalImage={croppedImage}
                onClose={action('onClose')}
                cropAndSave={saveAction}
            />
        )
    })

story('Profile/ChangePasswordDialog')
    .add('default', () => {
        const updatePassword = action('updatePassword')
        const updateAction = (...args) => new Promise((resolve) => {
            updatePassword(...args)
            resolve()
        })
        return (
            <ChangePasswordDialog
                isOpen
                updatePassword={updateAction}
                onToggle={action('onToggle')}
            />
        )
    })

story('EthereumIdentity/IdentityChallengeDialog')
    .add('signature request', () => (
        <SignatureRequestDialog
            onClose={action('onClose')}
        />
    ))
    .add('signature success', () => (
        <SignatureRequestSuccessDialog
            onClose={action('onClose')}
        />
    ))
    .add('signature error', () => (
        <SignatureRequestErrorDialog
            onClose={action('onClose')}
        />
    ))

story('EthereumIdentity/DuplicateIdentityDialog')
    .add('default', () => (
        <DuplicateIdentityDialog
            onClose={action('onClose')}
        />
    ))

story('EthereumIdentity/IdentityNameDialog')
    .add('default', () => (
        <IdentityNameDialog
            onClose={action('onClose')}
            onSave={action('onSave')}
        />
    ))
