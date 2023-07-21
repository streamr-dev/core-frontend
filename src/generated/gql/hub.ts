import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PaymentDetailsByChain = {
  __typename?: 'PaymentDetailsByChain';
  /** Ethereum address, account where the payment is directed to for project purchases */
  beneficiary: Scalars['Bytes']['output'];
  /** The domainId of the chain where the project can be purchased. It's a unique id assigned by hyperlane to each chain */
  domainId?: Maybe<Scalars['BigInt']['output']>;
  /** payment details id = projectId + '-' + domainId */
  id: Scalars['ID']['output'];
  /** Project price per second. This is a DATA-wei denominated amount (10^18th of DATA token). */
  pricePerSecond?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the token in which the payment goes to project beneficiary */
  pricingTokenAddress: Scalars['Bytes']['output'];
  /** Target project this payment details applies to */
  project: Project;
};

export type PaymentDetailsByChain_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PaymentDetailsByChain_Filter>>>;
  beneficiary?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiary_lt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_lte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  domainId?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PaymentDetailsByChain_Filter>>>;
  pricePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricingTokenAddress?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingTokenAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PaymentDetailsByChain_OrderBy {
  Beneficiary = 'beneficiary',
  DomainId = 'domainId',
  Id = 'id',
  PricePerSecond = 'pricePerSecond',
  PricingTokenAddress = 'pricingTokenAddress',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectUpdatedAt = 'project__updatedAt'
}

export type Permission = {
  __typename?: 'Permission';
  /** canBuy permission enables a user to buy the project */
  canBuy?: Maybe<Scalars['Boolean']['output']>;
  /** canDelete permission allows deleting the project from the ProjectRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** canEdit permission enables changing the project's fields */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** canGrant permission allows granting and revoking permissions to this project */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
  /** permission id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this permission */
  userAddress: Scalars['Bytes']['output'];
};

export type Permission_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Permission_Filter>>>;
  canBuy?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canBuy_not?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Permission_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Permission_OrderBy {
  CanBuy = 'canBuy',
  CanDelete = 'canDelete',
  CanEdit = 'canEdit',
  CanGrant = 'canGrant',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectUpdatedAt = 'project__updatedAt',
  UserAddress = 'userAddress'
}

export type Project = {
  __typename?: 'Project';
  /** Increases when various actions are triggered (e.g. purchase, stake, unstake). Used to generate unique ids */
  counter?: Maybe<Scalars['Int']['output']>;
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** List of domain ids for the chains from which this project can be purchased */
  domainIds: Array<Scalars['BigInt']['output']>;
  /** project id = bytes32 */
  id: Scalars['ID']['output'];
  /** Flags a project as being a data union, true iff 'isDataUnion' field is set to 'true' in the metadata JSON */
  isDataUnion?: Maybe<Scalars['Boolean']['output']>;
  /** Project metadata JSON */
  metadata: Scalars['String']['output'];
  /** The minimum amount of seconds for which a subscription can be extended. This is a normal int value (not wei) */
  minimumSubscriptionSeconds: Scalars['BigInt']['output'];
  /** Payment details for the chains where the project can be purchased: mapping (uint32 => PaymentDetailsByChain) */
  paymentDetails: Array<PaymentDetailsByChain>;
  /** Permissions mapping (bytes32 => Permission) */
  permissions: Array<Permission>;
  /** Marketplace purchases */
  purchases: Array<ProjectPurchase>;
  /** Incremented/decremented when Stake/Unstake events are fired. It may not always be 1:1 with the stake (with future implementations) */
  score?: Maybe<Scalars['BigInt']['output']>;
  /** Streams added to the project */
  streams: Array<Scalars['String']['output']>;
  /** Subscriptions mapping (address => TimeBasedSubscription) */
  subscriptions: Array<TimeBasedSubscription>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};


export type ProjectPaymentDetailsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PaymentDetailsByChain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentDetailsByChain_Filter>;
};


export type ProjectPermissionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Permission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Permission_Filter>;
};


export type ProjectPurchasesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type ProjectSubscriptionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TimeBasedSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TimeBasedSubscription_Filter>;
};

export type ProjectPurchase = {
  __typename?: 'ProjectPurchase';
  /** The amount of tokens paid to marketplace for project subscription */
  fee: Scalars['BigInt']['output'];
  /** project purchase id = projectId + '-' + subscriberAddress + '-' + counter */
  id: Scalars['ID']['output'];
  /** The amount of tokens paid to beneficiary for project subscription */
  price: Scalars['BigInt']['output'];
  /** Target project this purchase is for */
  project: Project;
  /** purchase date. This is a timestamp in seconds */
  purchasedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the account initiating the project purchase */
  subscriber: Scalars['Bytes']['output'];
  /** The amount of seconds by which the subscription is extended */
  subscriptionSeconds: Scalars['BigInt']['output'];
};

export type ProjectPurchase_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPurchase_Filter>>>;
  fee?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPurchase_Filter>>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  purchasedAt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchasedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriber?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriber_lt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_lte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProjectPurchase_OrderBy {
  Fee = 'fee',
  Id = 'id',
  Price = 'price',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectUpdatedAt = 'project__updatedAt',
  PurchasedAt = 'purchasedAt',
  Subscriber = 'subscriber',
  SubscriptionSeconds = 'subscriptionSeconds'
}

export type Project_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Project_Filter>>>;
  counter?: InputMaybe<Scalars['Int']['input']>;
  counter_gt?: InputMaybe<Scalars['Int']['input']>;
  counter_gte?: InputMaybe<Scalars['Int']['input']>;
  counter_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  counter_lt?: InputMaybe<Scalars['Int']['input']>;
  counter_lte?: InputMaybe<Scalars['Int']['input']>;
  counter_not?: InputMaybe<Scalars['Int']['input']>;
  counter_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isDataUnion?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDataUnion_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  minimumSubscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumSubscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Project_Filter>>>;
  paymentDetails?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_?: InputMaybe<PaymentDetailsByChain_Filter>;
  paymentDetails_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_?: InputMaybe<Permission_Filter>;
  permissions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_?: InputMaybe<ProjectPurchase_Filter>;
  purchases_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  score?: InputMaybe<Scalars['BigInt']['input']>;
  score_gt?: InputMaybe<Scalars['BigInt']['input']>;
  score_gte?: InputMaybe<Scalars['BigInt']['input']>;
  score_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  score_lt?: InputMaybe<Scalars['BigInt']['input']>;
  score_lte?: InputMaybe<Scalars['BigInt']['input']>;
  score_not?: InputMaybe<Scalars['BigInt']['input']>;
  score_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  streams?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_?: InputMaybe<TimeBasedSubscription_Filter>;
  subscriptions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Project_OrderBy {
  Counter = 'counter',
  CreatedAt = 'createdAt',
  DomainIds = 'domainIds',
  Id = 'id',
  IsDataUnion = 'isDataUnion',
  Metadata = 'metadata',
  MinimumSubscriptionSeconds = 'minimumSubscriptionSeconds',
  PaymentDetails = 'paymentDetails',
  Permissions = 'permissions',
  Purchases = 'purchases',
  Score = 'score',
  Streams = 'streams',
  Subscriptions = 'subscriptions',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  paymentDetailsByChain?: Maybe<PaymentDetailsByChain>;
  paymentDetailsByChains: Array<PaymentDetailsByChain>;
  permission?: Maybe<Permission>;
  permissions: Array<Permission>;
  project?: Maybe<Project>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectSearch: Array<Project>;
  projects: Array<Project>;
  staking?: Maybe<Staking>;
  stakings: Array<Staking>;
  timeBasedSubscription?: Maybe<TimeBasedSubscription>;
  timeBasedSubscriptions: Array<TimeBasedSubscription>;
  unstaking?: Maybe<Unstaking>;
  unstakings: Array<Unstaking>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryPaymentDetailsByChainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPaymentDetailsByChainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PaymentDetailsByChain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PaymentDetailsByChain_Filter>;
};


export type QueryPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Permission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Permission_Filter>;
};


export type QueryProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type QueryProjectSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
};


export type QueryProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type QueryStakingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staking_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staking_Filter>;
};


export type QueryTimeBasedSubscriptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTimeBasedSubscriptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TimeBasedSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimeBasedSubscription_Filter>;
};


export type QueryUnstakingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnstakingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaking_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaking_Filter>;
};

export type Staking = {
  __typename?: 'Staking';
  /** The amount being staked */
  amount: Scalars['BigInt']['output'];
  /** stake id = projectId + '-' + userAddress + '-' + counter */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** stake date. This is a timestamp in seconds */
  stakedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the account initiating the stake */
  user: Scalars['Bytes']['output'];
};

export type Staking_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Staking_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Staking_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedAt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Staking_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectUpdatedAt = 'project__updatedAt',
  StakedAt = 'stakedAt',
  User = 'user'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  paymentDetailsByChain?: Maybe<PaymentDetailsByChain>;
  paymentDetailsByChains: Array<PaymentDetailsByChain>;
  permission?: Maybe<Permission>;
  permissions: Array<Permission>;
  project?: Maybe<Project>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projects: Array<Project>;
  staking?: Maybe<Staking>;
  stakings: Array<Staking>;
  timeBasedSubscription?: Maybe<TimeBasedSubscription>;
  timeBasedSubscriptions: Array<TimeBasedSubscription>;
  unstaking?: Maybe<Unstaking>;
  unstakings: Array<Unstaking>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionPaymentDetailsByChainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPaymentDetailsByChainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PaymentDetailsByChain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PaymentDetailsByChain_Filter>;
};


export type SubscriptionPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Permission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Permission_Filter>;
};


export type SubscriptionProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type SubscriptionProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type SubscriptionStakingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staking_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staking_Filter>;
};


export type SubscriptionTimeBasedSubscriptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTimeBasedSubscriptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TimeBasedSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimeBasedSubscription_Filter>;
};


export type SubscriptionUnstakingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnstakingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaking_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaking_Filter>;
};

export type TimeBasedSubscription = {
  __typename?: 'TimeBasedSubscription';
  /** Subscription expiration time. This is a timestamp in seconds */
  endTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** subscription id = projectId + '-' + subscriberAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this subscription */
  userAddress: Scalars['Bytes']['output'];
};

export type TimeBasedSubscription_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimeBasedSubscription_Filter>>>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TimeBasedSubscription_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum TimeBasedSubscription_OrderBy {
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectUpdatedAt = 'project__updatedAt',
  UserAddress = 'userAddress'
}

export type Unstaking = {
  __typename?: 'Unstaking';
  /** The amount being unstaked */
  amount: Scalars['BigInt']['output'];
  /** unstake id = projectId + '-' + userAddress + '-' + counter */
  id: Scalars['ID']['output'];
  /** Target project this unstake is for */
  project: Project;
  /** unstake date. This is a timestamp in seconds */
  unstakedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the account initiating the unstake */
  user: Scalars['Bytes']['output'];
};

export type Unstaking_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Unstaking_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Unstaking_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unstakedAt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Unstaking_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectUpdatedAt = 'project__updatedAt',
  UnstakedAt = 'unstakedAt',
  User = 'user'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type ProjectFieldsFragment = { __typename?: 'Project', id: string, domainIds: Array<any>, score?: any | null, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'PaymentDetailsByChain', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'TimeBasedSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'Permission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, domainIds: Array<any>, score?: any | null, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'PaymentDetailsByChain', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'TimeBasedSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'Permission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> } | null };

export type GetProjectsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Project_Filter>;
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, domainIds: Array<any>, score?: any | null, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'PaymentDetailsByChain', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'TimeBasedSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'Permission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> }> };

export type GetProjectsByTextQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
}>;


export type GetProjectsByTextQuery = { __typename?: 'Query', projectSearch: Array<{ __typename?: 'Project', id: string, domainIds: Array<any>, score?: any | null, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'PaymentDetailsByChain', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'TimeBasedSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'Permission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> }> };

export const ProjectFieldsFragmentDoc = gql`
    fragment ProjectFields on Project {
  id
  domainIds
  score
  metadata
  streams
  minimumSubscriptionSeconds
  createdAt
  updatedAt
  isDataUnion
  paymentDetails {
    domainId
    beneficiary
    pricingTokenAddress
    pricePerSecond
  }
  subscriptions {
    userAddress
    endTimestamp
  }
  permissions {
    userAddress
    canBuy
    canDelete
    canEdit
    canGrant
  }
  purchases {
    subscriber
    subscriptionSeconds
    price
    fee
    purchasedAt
  }
}
    `;
export const GetProjectDocument = gql`
    query getProject($id: ID!) {
  project(id: $id) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects($first: Int, $skip: Int, $where: Project_filter) {
  projects(
    first: $first
    skip: $skip
    orderBy: score
    orderDirection: desc
    where: $where
  ) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectsByTextDocument = gql`
    query getProjectsByText($first: Int, $skip: Int, $text: String!) {
  projectSearch(first: $first, skip: $skip, text: $text) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectsByTextQueryResult = Apollo.QueryResult<GetProjectsByTextQuery, GetProjectsByTextQueryVariables>;