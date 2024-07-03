/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface RemoteMarketplaceV1Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "addRecipient"
      | "buy"
      | "buyFor"
      | "destinationDomainId"
      | "gasPaymaster"
      | "handlePurchaseInfo"
      | "handleSubscriptionState"
      | "initialize"
      | "mailbox"
      | "originDomainId"
      | "owner"
      | "proxiableUUID"
      | "purchaseCount"
      | "purchases"
      | "queryRouter"
      | "recipientAddress"
      | "renounceOwnership"
      | "transferOwnership"
      | "upgradeTo"
      | "upgradeToAndCall"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "Initialized"
      | "OwnershipTransferred"
      | "ProjectPurchasedFromRemote"
      | "Upgraded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addRecipient",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "buy",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "buyFor",
    values: [BytesLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "destinationDomainId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "gasPaymaster",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "handlePurchaseInfo",
    values: [
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "handleSubscriptionState",
    values: [boolean, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [BigNumberish, AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "mailbox", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "originDomainId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "purchaseCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "purchases",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "queryRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recipientAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buyFor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "destinationDomainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "gasPaymaster",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handlePurchaseInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleSubscriptionState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mailbox", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "originDomainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "purchaseCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "purchases", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "queryRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recipientAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace AdminChangedEvent {
  export type InputTuple = [previousAdmin: AddressLike, newAdmin: AddressLike];
  export type OutputTuple = [previousAdmin: string, newAdmin: string];
  export interface OutputObject {
    previousAdmin: string;
    newAdmin: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BeaconUpgradedEvent {
  export type InputTuple = [beacon: AddressLike];
  export type OutputTuple = [beacon: string];
  export interface OutputObject {
    beacon: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProjectPurchasedFromRemoteEvent {
  export type InputTuple = [
    projectId: BytesLike,
    subscriber: AddressLike,
    subscriptionSeconds: BigNumberish,
    price: BigNumberish,
    fee: BigNumberish
  ];
  export type OutputTuple = [
    projectId: string,
    subscriber: string,
    subscriptionSeconds: bigint,
    price: bigint,
    fee: bigint
  ];
  export interface OutputObject {
    projectId: string;
    subscriber: string;
    subscriptionSeconds: bigint;
    price: bigint;
    fee: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RemoteMarketplaceV1 extends BaseContract {
  connect(runner?: ContractRunner | null): RemoteMarketplaceV1;
  waitForDeployment(): Promise<this>;

  interface: RemoteMarketplaceV1Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addRecipient: TypedContractMethod<
    [
      _destinationDomainId: BigNumberish,
      _recipientContractAddress: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  buy: TypedContractMethod<
    [projectId: BytesLike, subscriptionSeconds: BigNumberish],
    [void],
    "nonpayable"
  >;

  buyFor: TypedContractMethod<
    [
      projectId: BytesLike,
      subscriptionSeconds: BigNumberish,
      subscriber: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  destinationDomainId: TypedContractMethod<[], [bigint], "view">;

  gasPaymaster: TypedContractMethod<[], [string], "view">;

  handlePurchaseInfo: TypedContractMethod<
    [
      beneficiary: AddressLike,
      pricingTokenAddress: AddressLike,
      price: BigNumberish,
      fee: BigNumberish,
      purchaseId: BigNumberish,
      streamsCount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  handleSubscriptionState: TypedContractMethod<
    [isValid: boolean, subEndTimestamp: BigNumberish, purchaseId: BigNumberish],
    [void],
    "nonpayable"
  >;

  initialize: TypedContractMethod<
    [
      _originDomainId: BigNumberish,
      _queryRouter: AddressLike,
      _mailboxAddress: AddressLike,
      _gasPaymaster: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  mailbox: TypedContractMethod<[], [string], "view">;

  originDomainId: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  purchaseCount: TypedContractMethod<[], [bigint], "view">;

  purchases: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [
        string,
        string,
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        projectId: string;
        buyer: string;
        subscriber: string;
        beneficiary: string;
        pricingTokenAddress: string;
        subscriptionSeconds: bigint;
        requestTimestamp: bigint;
        price: bigint;
        fee: bigint;
      }
    ],
    "view"
  >;

  queryRouter: TypedContractMethod<[], [string], "view">;

  recipientAddress: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeTo: TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  withdraw: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addRecipient"
  ): TypedContractMethod<
    [
      _destinationDomainId: BigNumberish,
      _recipientContractAddress: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "buy"
  ): TypedContractMethod<
    [projectId: BytesLike, subscriptionSeconds: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "buyFor"
  ): TypedContractMethod<
    [
      projectId: BytesLike,
      subscriptionSeconds: BigNumberish,
      subscriber: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "destinationDomainId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "gasPaymaster"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "handlePurchaseInfo"
  ): TypedContractMethod<
    [
      beneficiary: AddressLike,
      pricingTokenAddress: AddressLike,
      price: BigNumberish,
      fee: BigNumberish,
      purchaseId: BigNumberish,
      streamsCount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "handleSubscriptionState"
  ): TypedContractMethod<
    [isValid: boolean, subEndTimestamp: BigNumberish, purchaseId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      _originDomainId: BigNumberish,
      _queryRouter: AddressLike,
      _mailboxAddress: AddressLike,
      _gasPaymaster: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "mailbox"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "originDomainId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "purchaseCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "purchases"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [
        string,
        string,
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        projectId: string;
        buyer: string;
        subscriber: string;
        beneficiary: string;
        pricingTokenAddress: string;
        subscriptionSeconds: bigint;
        requestTimestamp: bigint;
        price: bigint;
        fee: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "queryRouter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "recipientAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeTo"
  ): TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;

  getEvent(
    key: "AdminChanged"
  ): TypedContractEvent<
    AdminChangedEvent.InputTuple,
    AdminChangedEvent.OutputTuple,
    AdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "BeaconUpgraded"
  ): TypedContractEvent<
    BeaconUpgradedEvent.InputTuple,
    BeaconUpgradedEvent.OutputTuple,
    BeaconUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "ProjectPurchasedFromRemote"
  ): TypedContractEvent<
    ProjectPurchasedFromRemoteEvent.InputTuple,
    ProjectPurchasedFromRemoteEvent.OutputTuple,
    ProjectPurchasedFromRemoteEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;

  filters: {
    "AdminChanged(address,address)": TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;
    AdminChanged: TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;

    "BeaconUpgraded(address)": TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;
    BeaconUpgraded: TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "ProjectPurchasedFromRemote(bytes32,address,uint256,uint256,uint256)": TypedContractEvent<
      ProjectPurchasedFromRemoteEvent.InputTuple,
      ProjectPurchasedFromRemoteEvent.OutputTuple,
      ProjectPurchasedFromRemoteEvent.OutputObject
    >;
    ProjectPurchasedFromRemote: TypedContractEvent<
      ProjectPurchasedFromRemoteEvent.InputTuple,
      ProjectPurchasedFromRemoteEvent.OutputTuple,
      ProjectPurchasedFromRemoteEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
  };
}