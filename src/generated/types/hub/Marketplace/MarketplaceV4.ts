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

export interface MarketplaceV4Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "addMailbox"
      | "addRemoteMarketplace"
      | "buy"
      | "buyFor"
      | "chainId"
      | "claimOwnership"
      | "getPurchaseInfo"
      | "getSubscriptionInfo"
      | "halt"
      | "halted"
      | "handle"
      | "initialize"
      | "isTrustedForwarder"
      | "mailbox"
      | "onTokenTransfer"
      | "owner"
      | "pendingOwner"
      | "projectRegistry"
      | "proxiableUUID"
      | "remoteMarketplaces"
      | "renounceOwnership"
      | "resume"
      | "setTxFee"
      | "transferOwnership"
      | "txFee"
      | "upgradeTo"
      | "upgradeToAndCall"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "Halted"
      | "Initialized"
      | "OwnershipTransferred"
      | "ProjectPurchased"
      | "Resumed"
      | "TxFeeChanged"
      | "Upgraded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addMailbox",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addRemoteMarketplace",
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
  encodeFunctionData(functionFragment: "chainId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claimOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPurchaseInfo",
    values: [BytesLike, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getSubscriptionInfo",
    values: [BytesLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "halt", values?: undefined): string;
  encodeFunctionData(functionFragment: "halted", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "handle",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "mailbox", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onTokenTransfer",
    values: [AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "projectRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "remoteMarketplaces",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "resume", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setTxFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "txFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "addMailbox", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addRemoteMarketplace",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buyFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "chainId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPurchaseInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubscriptionInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "halt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "halted", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "handle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mailbox", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onTokenTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "projectRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "remoteMarketplaces",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "resume", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setTxFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "txFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
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

export namespace HaltedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
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

export namespace ProjectPurchasedEvent {
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

export namespace ResumedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TxFeeChangedEvent {
  export type InputTuple = [newTxFee: BigNumberish];
  export type OutputTuple = [newTxFee: bigint];
  export interface OutputObject {
    newTxFee: bigint;
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

export interface MarketplaceV4 extends BaseContract {
  connect(runner?: ContractRunner | null): MarketplaceV4;
  waitForDeployment(): Promise<this>;

  interface: MarketplaceV4Interface;

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

  addMailbox: TypedContractMethod<
    [mailboxAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  addRemoteMarketplace: TypedContractMethod<
    [remoteChainId: BigNumberish, remoteMarketplaceAddress: AddressLike],
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

  chainId: TypedContractMethod<[], [bigint], "view">;

  claimOwnership: TypedContractMethod<[], [void], "nonpayable">;

  getPurchaseInfo: TypedContractMethod<
    [
      projectId: BytesLike,
      subscriptionSeconds: BigNumberish,
      originDomainId: BigNumberish,
      purchaseId: BigNumberish
    ],
    [[string, string, bigint, bigint, bigint, bigint]],
    "view"
  >;

  getSubscriptionInfo: TypedContractMethod<
    [projectId: BytesLike, subscriber: AddressLike, purchaseId: BigNumberish],
    [[boolean, bigint, bigint]],
    "view"
  >;

  halt: TypedContractMethod<[], [void], "nonpayable">;

  halted: TypedContractMethod<[], [boolean], "view">;

  handle: TypedContractMethod<
    [_origin: BigNumberish, _sender: BytesLike, _message: BytesLike],
    [void],
    "nonpayable"
  >;

  initialize: TypedContractMethod<
    [_projectRegistry: AddressLike, _chainId: BigNumberish],
    [void],
    "nonpayable"
  >;

  isTrustedForwarder: TypedContractMethod<
    [forwarder: AddressLike],
    [boolean],
    "view"
  >;

  mailbox: TypedContractMethod<[], [string], "view">;

  onTokenTransfer: TypedContractMethod<
    [sender: AddressLike, amount: BigNumberish, data: BytesLike],
    [void],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  pendingOwner: TypedContractMethod<[], [string], "view">;

  projectRegistry: TypedContractMethod<[], [string], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  remoteMarketplaces: TypedContractMethod<
    [arg0: BigNumberish],
    [string],
    "view"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  resume: TypedContractMethod<[], [void], "nonpayable">;

  setTxFee: TypedContractMethod<[newTxFee: BigNumberish], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  txFee: TypedContractMethod<[], [bigint], "view">;

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

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addMailbox"
  ): TypedContractMethod<[mailboxAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addRemoteMarketplace"
  ): TypedContractMethod<
    [remoteChainId: BigNumberish, remoteMarketplaceAddress: AddressLike],
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
    nameOrSignature: "chainId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "claimOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getPurchaseInfo"
  ): TypedContractMethod<
    [
      projectId: BytesLike,
      subscriptionSeconds: BigNumberish,
      originDomainId: BigNumberish,
      purchaseId: BigNumberish
    ],
    [[string, string, bigint, bigint, bigint, bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSubscriptionInfo"
  ): TypedContractMethod<
    [projectId: BytesLike, subscriber: AddressLike, purchaseId: BigNumberish],
    [[boolean, bigint, bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "halt"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "halted"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "handle"
  ): TypedContractMethod<
    [_origin: BigNumberish, _sender: BytesLike, _message: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [_projectRegistry: AddressLike, _chainId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "isTrustedForwarder"
  ): TypedContractMethod<[forwarder: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "mailbox"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "onTokenTransfer"
  ): TypedContractMethod<
    [sender: AddressLike, amount: BigNumberish, data: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pendingOwner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "projectRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "remoteMarketplaces"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "resume"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setTxFee"
  ): TypedContractMethod<[newTxFee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "txFee"
  ): TypedContractMethod<[], [bigint], "view">;
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
    key: "Halted"
  ): TypedContractEvent<
    HaltedEvent.InputTuple,
    HaltedEvent.OutputTuple,
    HaltedEvent.OutputObject
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
    key: "ProjectPurchased"
  ): TypedContractEvent<
    ProjectPurchasedEvent.InputTuple,
    ProjectPurchasedEvent.OutputTuple,
    ProjectPurchasedEvent.OutputObject
  >;
  getEvent(
    key: "Resumed"
  ): TypedContractEvent<
    ResumedEvent.InputTuple,
    ResumedEvent.OutputTuple,
    ResumedEvent.OutputObject
  >;
  getEvent(
    key: "TxFeeChanged"
  ): TypedContractEvent<
    TxFeeChangedEvent.InputTuple,
    TxFeeChangedEvent.OutputTuple,
    TxFeeChangedEvent.OutputObject
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

    "Halted()": TypedContractEvent<
      HaltedEvent.InputTuple,
      HaltedEvent.OutputTuple,
      HaltedEvent.OutputObject
    >;
    Halted: TypedContractEvent<
      HaltedEvent.InputTuple,
      HaltedEvent.OutputTuple,
      HaltedEvent.OutputObject
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

    "ProjectPurchased(bytes32,address,uint256,uint256,uint256)": TypedContractEvent<
      ProjectPurchasedEvent.InputTuple,
      ProjectPurchasedEvent.OutputTuple,
      ProjectPurchasedEvent.OutputObject
    >;
    ProjectPurchased: TypedContractEvent<
      ProjectPurchasedEvent.InputTuple,
      ProjectPurchasedEvent.OutputTuple,
      ProjectPurchasedEvent.OutputObject
    >;

    "Resumed()": TypedContractEvent<
      ResumedEvent.InputTuple,
      ResumedEvent.OutputTuple,
      ResumedEvent.OutputObject
    >;
    Resumed: TypedContractEvent<
      ResumedEvent.InputTuple,
      ResumedEvent.OutputTuple,
      ResumedEvent.OutputObject
    >;

    "TxFeeChanged(uint256)": TypedContractEvent<
      TxFeeChangedEvent.InputTuple,
      TxFeeChangedEvent.OutputTuple,
      TxFeeChangedEvent.OutputObject
    >;
    TxFeeChanged: TypedContractEvent<
      TxFeeChangedEvent.InputTuple,
      TxFeeChangedEvent.OutputTuple,
      TxFeeChangedEvent.OutputObject
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