// @flow

import React from 'react'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import { withKnobs, select, text, number, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import BN from 'bignumber.js'
import { Translate } from 'react-redux-i18n'

import { transactionStates, ProgrammingLanguages } from '$shared/utils/constants'
import { actionsTypes } from '$mp/containers/EditProductPage/publishQueue'
import PngIcon from '$shared/components/PngIcon'

import croppedImage from '$mp/assets/product_standard.png'
import { publishModes } from '$mp/containers/EditProductPage/usePublish'

// marketplace
import PublishTransactionProgress from '$mp/components/Modal/PublishTransactionProgress'
import ConfirmSaveDialog from '$mp/components/Modal/ConfirmSaveDialog'
import PublishComplete from '$mp/components/Modal/PublishComplete'
import PublishError from '$mp/components/Modal/PublishError'
import GuidedDeployDataUnionDialog from '$mp/components/Modal/GuidedDeployDataUnionDialog'
import ConfirmDeployDataUnionDialog from '$mp/components/Modal/ConfirmDeployDataUnionDialog'
import DeployingDataUnionDialog from '$mp/components/Modal/DeployingDataUnionDialog'
import GetDataTokensDialog from '$mp/components/Modal/GetDataTokensDialog'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import InsufficientDataDialog from '$mp/components/Modal/InsufficientDataDialog'
import InsufficientDaiDialog from '$mp/components/Modal/InsufficientDaiDialog'
import InsufficientEthDialog from '$mp/components/Modal/InsufficientEthDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import ChooseAccessPeriodDialog from '$mp/components/Modal/ChooseAccessPeriodDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import ConnectEthereumAddressDialog from '$mp/components/Modal/ConnectEthereumAddressDialog'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import CropImageModal from '$mp/components/Modal/CropImageModal'

// userpages
import ConfirmCsvImportDialog from '$userpages/components/StreamPage/ConfirmCsvImportDialog'
import SnippetDialog from '$userpages/components/SnippetDialog'
import AvatarUploadDialog from '$userpages/components/ProfilePage/ProfileSettings/EditAvatarDialog/AvatarUploadDialog'
import CropAvatarDialog from '$userpages/components/ProfilePage/ProfileSettings/EditAvatarDialog/CropAvatarDialog'
import { ChangePasswordDialogComponent } from '$userpages/components/ProfilePage/ProfileSettings/ChangePasswordDialog'
import { SignatureRequestDialog, DuplicateIdentityDialog } from '$userpages/components/ProfilePage/IdentityHandler/IdentityChallengeDialog'
import IdentityNameDialog from '$userpages/components/ProfilePage/IdentityHandler/IdentityNameDialog'
import EthereumAccountCreatedDialog from '$userpages/components/ProfilePage/IdentityHandler/EthereumAccountCreatedDialog'
import CopyPrivateKeyDialog from '$userpages/components/ProfilePage/IdentityHandler/CopyPrivateKeyDialog'
import { DeleteAccountDialogComponent } from '$userpages/components/ProfilePage/DeleteAccount/DeleteAccountDialog'

// shared
import ConfirmDialog from '$shared/components/ConfirmDialog'
import UnlockWalletDialog from '$shared/components/Web3ErrorDialog/UnlockWalletDialog'
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
        fontSize: '16px',
    }))
    .addDecorator((storyFn) => (
        <div>
            <div id="content">{storyFn()}</div>
            <div id="modal-root" />
        </div>
    ))

const options = [
    transactionStates.STARTED,
    transactionStates.PENDING,
    transactionStates.CONFIRMED,
    transactionStates.FAILED,
]

story('Product Editor/PublishTransactionProgress')
    .add('Publish', () => {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.STARTED)
        const updateContractStatus = select('Edit product price', options, transactionStates.STARTED)
        const createContractStatus = select('Create contract product', options, transactionStates.STARTED)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.STARTED)
        const publishFreeStatus = select('Publish free', options, transactionStates.STARTED)
        const publishPendingStatus = select('Publish penging changes', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
            [actionsTypes.PUBLISH_PENDING_CHANGES]: publishPendingStatus,
        }

        return (
            <PublishTransactionProgress
                publishMode={publishModes.PUBLISH}
                onCancel={action('cancel')}
                status={statuses}
                isPrompted={boolean('Prompted', false)}
            />
        )
    })
    .add('Republish', () => {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.STARTED)
        const updateContractStatus = select('Edit product price', options, transactionStates.STARTED)
        const createContractStatus = select('Create contract product', options, transactionStates.STARTED)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.STARTED)
        const publishFreeStatus = select('Publish free', options, transactionStates.STARTED)
        const publishPendingStatus = select('Publish penging changes', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
            [actionsTypes.PUBLISH_PENDING_CHANGES]: publishPendingStatus,
        }

        return (
            <PublishTransactionProgress
                publishMode={publishModes.REPUBLISH}
                onCancel={action('cancel')}
                status={statuses}
                isPrompted={boolean('Prompted', false)}
            />
        )
    })
    .add('Redeploy', () => {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.STARTED)
        const updateContractStatus = select('Edit product price', options, transactionStates.STARTED)
        const createContractStatus = select('Create contract product', options, transactionStates.STARTED)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.STARTED)
        const publishFreeStatus = select('Publish free', options, transactionStates.STARTED)
        const publishPendingStatus = select('Publish penging changes', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
            [actionsTypes.PUBLISH_PENDING_CHANGES]: publishPendingStatus,
        }

        return (
            <PublishTransactionProgress
                publishMode={publishModes.REDEPLOY}
                onCancel={action('cancel')}
                status={statuses}
                isPrompted={boolean('Prompted', false)}
            />
        )
    })
    .add('Unpublish', () => {
        const unpublishFreeStatus = select('Unpublish free', options, transactionStates.STARTED)
        const undeployPaidStatus = select('Undeploy paid', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UNPUBLISH_FREE]: unpublishFreeStatus,
            [actionsTypes.UNDEPLOY_CONTRACT_PRODUCT]: undeployPaidStatus,
        }

        return (
            <PublishTransactionProgress
                publishMode={publishModes.UNPUBLISH}
                onCancel={action('cancel')}
                status={statuses}
            />
        )
    })

story('Product Editor/PublishComplete')
    .add('Publish', () => (
        <PublishComplete
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            productId={text('Product id', '1ff644fdb6ba40a287af2e607b131f32aaad9872ddd54e79b1106ff916e12890')}
            publishMode={publishModes.PUBLISH}
        />
    ))
    .add('Redeploy', () => (
        <PublishComplete
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            productId={text('Product id', '1ff644fdb6ba40a287af2e607b131f32aaad9872ddd54e79b1106ff916e12890')}
            publishMode={publishModes.REDEPLOY}
        />
    ))
    .add('Republish', () => (
        <PublishComplete
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            productId={text('Product id', '1ff644fdb6ba40a287af2e607b131f32aaad9872ddd54e79b1106ff916e12890')}
            publishMode={publishModes.REPUBLISH}
        />
    ))
    .add('Unpublish', () => (
        <PublishComplete
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            productId={text('Product id', '1ff644fdb6ba40a287af2e607b131f32aaad9872ddd54e79b1106ff916e12890')}
            publishMode={publishModes.UNPUBLISH}
        />
    ))

story('Product Editor/PublishError')
    .add('Publish', () => {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.STARTED)
        const updateContractStatus = select('Edit product price', options, transactionStates.STARTED)
        const createContractStatus = select('Create contract product', options, transactionStates.STARTED)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.STARTED)
        const publishFreeStatus = select('Publish free', options, transactionStates.STARTED)
        const publishPendingStatus = select('Publish penging changes', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
            [actionsTypes.PUBLISH_PENDING_CHANGES]: publishPendingStatus,
        }

        return (
            <PublishError
                onClose={action('onClose')}
                status={statuses}
                publishMode={publishModes.PUBLISH}
            />
        )
    })
    .add('Republish', () => {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.STARTED)
        const updateContractStatus = select('Edit product price', options, transactionStates.STARTED)
        const createContractStatus = select('Create contract product', options, transactionStates.STARTED)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.STARTED)
        const publishFreeStatus = select('Publish free', options, transactionStates.STARTED)
        const publishPendingStatus = select('Publish penging changes', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
            [actionsTypes.PUBLISH_PENDING_CHANGES]: publishPendingStatus,
        }

        return (
            <PublishError
                onClose={action('onClose')}
                status={statuses}
                publishMode={publishModes.REPUBLISH}
            />
        )
    })
    .add('Redeploy', () => {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.STARTED)
        const updateContractStatus = select('Edit product price', options, transactionStates.STARTED)
        const createContractStatus = select('Create contract product', options, transactionStates.STARTED)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.STARTED)
        const publishFreeStatus = select('Publish free', options, transactionStates.STARTED)
        const publishPendingStatus = select('Publish penging changes', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
            [actionsTypes.PUBLISH_PENDING_CHANGES]: publishPendingStatus,
        }

        return (
            <PublishError
                onClose={action('onClose')}
                status={statuses}
                publishMode={publishModes.REDEPLOY}
            />
        )
    })
    .add('Unpublish', () => {
        const unpublishFreeStatus = select('Unpublish free', options, transactionStates.STARTED)
        const undeployPaidStatus = select('Undeploy paid', options, transactionStates.STARTED)

        const statuses = {
            [actionsTypes.UNPUBLISH_FREE]: unpublishFreeStatus,
            [actionsTypes.UNDEPLOY_CONTRACT_PRODUCT]: undeployPaidStatus,
        }

        return (
            <PublishError
                onClose={action('onClose')}
                status={statuses}
                publishMode={publishModes.UNPUBLISH}
            />
        )
    })

story('Product Editor/ReadyToPublishDialog')
    .add('Publish', () => (
        <ReadyToPublishDialog
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
            publishMode={publishModes.PUBLISH}
        />
    ))
    .add('Republish', () => (
        <ReadyToPublishDialog
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
            publishMode={publishModes.REPUBLISH}
        />
    ))
    .add('Redeploy', () => (
        <ReadyToPublishDialog
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
            publishMode={publishModes.REDEPLOY}
        />
    ))
    .add('Unpublish', () => (
        <ReadyToPublishDialog
            onCancel={action('onCancel')}
            onContinue={action('onContinue')}
            publishMode={publishModes.UNPUBLISH}
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

story('Product Editor/GuidedDeployDataUnionDialog')
    .add('default', () => (
        <GuidedDeployDataUnionDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'DATAUNION',
            }}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
        />
    ))

story('Product Editor/ConfirmDeployDataUnionDialog')
    .add('default', () => (
        <ConfirmDeployDataUnionDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'DATAUNION',
            }}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            onShowGuidedDialog={action('onShowGuidedDialog')}
        />
    ))

story('Product Editor/DeployingCommunityDialog')
    .add('default', () => (
        <DeployingDataUnionDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'DATAUNION',
            }}
            estimate={number('Estimate', 360)}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
        />
    ))
    .add('minimized', () => (
        <DeployingDataUnionDialog
            // $FlowFixMe
            product={{
                id: '1',
                name: 'Example product',
                type: 'DATAUNION',
            }}
            estimate={number('Estimate', 360)}
            onClose={action('onClose')}
            onContinue={action('onContinue')}
            minimized
        />
    ))

story('Marketplace/GetDataTokensDialog')
    .add('default', () => (
        <GetDataTokensDialog
            onCancel={action('onCancel')}
        />
    ))
    .add('default iPhone', () => (
        <GetDataTokensDialog
            onCancel={action('onCancel')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })

story('Marketplace/GetCryptoDialog')
    .add('default', () => (
        <GetCryptoDialog
            onCancel={action('onCancel')}
        />
    ))
    .add('default (iPhone)', () => (
        <GetCryptoDialog
            onCancel={action('onCancel')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })

story('Marketplace/InsufficientDataDialog')
    .add('default', () => (
        <InsufficientDataDialog
            onCancel={action('onCancel')}
        />
    ))
    .add('default (iPhone)', () => (
        <InsufficientDataDialog
            onCancel={action('onCancel')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })

story('Marketplace/InsufficientDaiDialog')
    .add('default', () => (
        <InsufficientDaiDialog
            onCancel={action('onCancel')}
        />
    ))
    .add('default (iPhone)', () => (
        <InsufficientDaiDialog
            onCancel={action('onCancel')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })

story('Marketplace/InsufficientEthDialog')
    .add('default', () => (
        <InsufficientEthDialog
            onCancel={action('onCancel')}
        />
    ))
    .add('default (iPhone)', () => (
        <InsufficientEthDialog
            onCancel={action('onCancel')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })

story('Marketplace/NoBalanceDialog')
    .add('eth balance 0', () => (
        <NoBalanceDialog
            requiredGasBalance={BN(0)}
            requiredEthBalance={BN(0)}
            currentEthBalance={BN(0)}
            requiredDataBalance={BN(0)}
            currentDataBalance={BN(0)}
            currentDaiBalance={BN(0)}
            requiredDaiBalance={BN(0)}
            paymentCurrency="DATA"
            onCancel={action('onCancel')}
        />
    ))
    .add('eth balance < required', () => (
        <NoBalanceDialog
            requiredGasBalance={BN(1)}
            requiredEthBalance={BN(2)}
            currentEthBalance={BN(1)}
            requiredDataBalance={BN(0)}
            currentDataBalance={BN(0)}
            currentDaiBalance={BN(0)}
            requiredDaiBalance={BN(0)}
            paymentCurrency="DATA"
            onCancel={action('onCancel')}
        />
    ))
    .add('DATA balance 0', () => (
        <NoBalanceDialog
            requiredGasBalance={BN(0)}
            requiredEthBalance={BN(2)}
            currentEthBalance={BN(3)}
            requiredDataBalance={BN(0)}
            currentDataBalance={BN(0)}
            currentDaiBalance={BN(0)}
            requiredDaiBalance={BN(0)}
            paymentCurrency="DATA"
            onCancel={action('onCancel')}
        />
    ))
    .add('DATA balance < required', () => (
        <NoBalanceDialog
            requiredGasBalance={BN(0)}
            requiredEthBalance={BN(2)}
            currentEthBalance={BN(3)}
            requiredDataBalance={BN(3)}
            currentDataBalance={BN(2)}
            currentDaiBalance={BN(0)}
            requiredDaiBalance={BN(0)}
            paymentCurrency="DATA"
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
            ethPrice={BN(124)}
            daiPrice={BN(125)}
            dataPerUsd="0.1"
            ethPriceInUsd="1"
            paymentCurrency="DATA"
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
            ethPrice={BN(124)}
            daiPrice={BN(125)}
            dataPerUsd="0.1"
            ethPriceInUsd="1"
            paymentCurrency="DATA"
            time="24"
            timeUnit="hour"
            onCancel={action('onCancel')}
            onPay={action('onPay')}
            purchaseStarted
        />
    ))

story('Marketplace/ConnectEthereumAddressDialog')
    .add('default', () => (
        <ConnectEthereumAddressDialog
            onCancel={action('close')}
            onSet={action('onSet')}
        />
    ))
    .add('default (iPhone)', () => (
        <ConnectEthereumAddressDialog
            onCancel={action('close')}
            onSet={action('onSet')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })
    .add('waiting', () => (
        <ConnectEthereumAddressDialog
            onCancel={action('close')}
            onSet={action('onSet')}
            waiting
        />
    ))

story('Marketplace/SetAllowanceDialog')
    .add('default', () => (
        <SetAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            paymentCurrency="DATA"
        />
    ))
    .add('getting allowance', () => (
        <SetAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            gettingAllowance
            paymentCurrency="DATA"
        />
    ))
    .add('setting allowance', () => (
        <SetAllowanceDialog
            onCancel={action('onCancel')}
            onSet={action('onSet')}
            settingAllowance
            paymentCurrency="DATA"
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
        <UnlockWalletDialog
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
        />
    ))
    .add('with text', () => (
        <UnlockWalletDialog
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
        >
            {text('Dialog text', 'Please unlock your wallet')}
        </UnlockWalletDialog>
    ))
    .add('with address', () => (
        <UnlockWalletDialog
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
            requiredAddress="0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0"
        >
            <Translate
                value="unlockWalletDialog.message"
                tag="p"
            />
        </UnlockWalletDialog>
    ))
    .add('with address (iPhone)', () => (
        <UnlockWalletDialog
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
            requiredAddress="0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0"
        >
            <Translate
                value="unlockWalletDialog.message"
                tag="p"
            />
        </UnlockWalletDialog>
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })
    .add('with different icon', () => (
        <UnlockWalletDialog
            title={text('Dialog title', 'Dialog title')}
            onClose={action('onClose')}
            icon={select('Icon', PngIcon.names, 'walletError')}
        >
            {text('Dialog text', 'Please unlock your wallet')}
        </UnlockWalletDialog>
    ))
    .add('waiting', () => (
        <UnlockWalletDialog
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
    .add('install Metamask (iPhone)', () => (
        <InstallMetaMaskDialog
            onClose={action('onClose')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })
    .add('install mobile app', () => (
        <InstallMobileApplicationDialog
            onClose={action('onClose')}
        />
    ))
    .add('install mobile app (iPhone)', () => (
        <InstallMobileApplicationDialog
            onClose={action('onClose')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })
    .add('install supported browser', () => (
        <InstallSupportedBrowserDialog
            onClose={action('onClose')}
        />
    ))
    .add('install supported browser (iPhone)', () => (
        <InstallSupportedBrowserDialog
            onClose={action('onClose')}
        />
    ), {
        viewport: {
            defaultViewport: 'iPhone',
        },
    })

story('Profile/AvatarUploadDialog')
    .add('default', () => (
        <AvatarUploadDialog
            originalImage=""
            onClose={action('onClose')}
            onUpload={action('onUpload')}
        />
    ))
    .add('with original image', () => (
        <AvatarUploadDialog
            originalImage="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
            onClose={action('onClose')}
            onUpload={action('onUpload')}
        />
    ))

story('Profile/CropAvatarDialog')
    .add('default', () => (
        <CropAvatarDialog
            originalImage={croppedImage}
            onClose={action('onClose')}
            onSave={action('onSave')}
        />
    ))
    .add('waiting', () => (
        <CropAvatarDialog
            originalImage={croppedImage}
            onClose={action('onClose')}
            onSave={action('onSave')}
            waiting
        />
    ))

story('Profile/ChangePasswordDialog')
    .add('default', () => (
        <ChangePasswordDialogComponent
            onSave={action('onSave')}
            onClose={action('onClose')}
        />
    ))
    .add('waiting', () => (
        <ChangePasswordDialogComponent
            onSave={action('onSave')}
            onClose={action('onClose')}
            waiting
        />
    ))
    .add('mobile', () => (
        <ChangePasswordDialogComponent
            onSave={action('onSave')}
            onClose={action('onClose')}
        />
    ), {
        viewport: {
            defaultViewport: 'sm',
        },
    })

story('Profile/DeleteAccountDialog')
    .add('default', () => (
        <DeleteAccountDialogComponent
            onClose={action('onClose')}
            onSave={action('onSave')}
        />
    ))
    .add('waiting', () => (
        <DeleteAccountDialogComponent
            onClose={action('onClose')}
            onSave={action('onSave')}
            waiting
        />
    ))

story('EthereumIdentity/IdentityChallengeDialog')
    .add('signature request', () => (
        <SignatureRequestDialog
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
            onCancel={action('onCancel')}
            onSave={action('onSave')}
        />
    ))
    .add('initial value', () => (
        <IdentityNameDialog
            onClose={action('onClose')}
            onCancel={action('onCancel')}
            onSave={action('onSave')}
            initialValue="My Eth address"
        />
    ))
    .add('waiting', () => (
        <IdentityNameDialog
            onClose={action('onClose')}
            onCancel={action('onCancel')}
            onSave={action('onSave')}
            waiting
        />
    ))

story('EthereumIdentity/EthereumAccountCreatedDialog')
    .add('default', () => (
        <EthereumAccountCreatedDialog
            onBack={action('onBack')}
            onSave={action('onSave')}
            name={text('Name', 'Main Eth account')}
            address={text('Address', '0x538a2Fa87E03B280e10C83AA8dD7E5B15B868BD9')}
        />
    ))

story('EthereumIdentity/CopyPrivateKeyDialog')
    .add('default', () => (
        <CopyPrivateKeyDialog
            onClose={action('onClose')}
            privateKey={text('Private Key', '1234567890abcdefg')}
        />
    ))
