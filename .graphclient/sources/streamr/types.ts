// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace StreamrTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
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

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Delegation = {
  id: Scalars['ID']['output'];
  operator?: Maybe<Operator>;
  delegator: Scalars['String']['output'];
  /** Pool tokens held by a delegator in this Operator contract */
  poolTokenWei: Scalars['BigInt']['output'];
};

export type Delegation_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_filter>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolTokenWei?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolTokenWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Delegation_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Delegation_filter>>>;
};

export type Delegation_orderBy =
  | 'id'
  | 'operator'
  | 'operator__id'
  | 'operator__delegatorCount'
  | 'operator__poolValue'
  | 'operator__totalValueInSponsorshipsWei'
  | 'operator__freeFundsWei'
  | 'operator__poolValueTimestamp'
  | 'operator__poolValueBlockNumber'
  | 'operator__poolTokenTotalSupplyWei'
  | 'operator__exchangeRate'
  | 'operator__metadataJsonString'
  | 'operator__owner'
  | 'delegator'
  | 'poolTokenWei';

export type Flag = {
  id: Scalars['ID']['output'];
  flagger: Operator;
  target: Operator;
  date?: Maybe<Scalars['BigInt']['output']>;
  sponsorship?: Maybe<Sponsorship>;
  result: Scalars['BigInt']['output'];
  targetSlashAmount?: Maybe<Scalars['BigInt']['output']>;
};

export type Flag_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  flagger?: InputMaybe<Scalars['String']['input']>;
  flagger_not?: InputMaybe<Scalars['String']['input']>;
  flagger_gt?: InputMaybe<Scalars['String']['input']>;
  flagger_lt?: InputMaybe<Scalars['String']['input']>;
  flagger_gte?: InputMaybe<Scalars['String']['input']>;
  flagger_lte?: InputMaybe<Scalars['String']['input']>;
  flagger_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flagger_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flagger_contains?: InputMaybe<Scalars['String']['input']>;
  flagger_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_contains?: InputMaybe<Scalars['String']['input']>;
  flagger_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_starts_with?: InputMaybe<Scalars['String']['input']>;
  flagger_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flagger_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_ends_with?: InputMaybe<Scalars['String']['input']>;
  flagger_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flagger_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_?: InputMaybe<Operator_filter>;
  target?: InputMaybe<Scalars['String']['input']>;
  target_not?: InputMaybe<Scalars['String']['input']>;
  target_gt?: InputMaybe<Scalars['String']['input']>;
  target_lt?: InputMaybe<Scalars['String']['input']>;
  target_gte?: InputMaybe<Scalars['String']['input']>;
  target_lte?: InputMaybe<Scalars['String']['input']>;
  target_in?: InputMaybe<Array<Scalars['String']['input']>>;
  target_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  target_contains?: InputMaybe<Scalars['String']['input']>;
  target_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_contains?: InputMaybe<Scalars['String']['input']>;
  target_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  target_starts_with?: InputMaybe<Scalars['String']['input']>;
  target_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  target_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_ends_with?: InputMaybe<Scalars['String']['input']>;
  target_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  target_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_?: InputMaybe<Operator_filter>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_filter>;
  result?: InputMaybe<Scalars['BigInt']['input']>;
  result_not?: InputMaybe<Scalars['BigInt']['input']>;
  result_gt?: InputMaybe<Scalars['BigInt']['input']>;
  result_lt?: InputMaybe<Scalars['BigInt']['input']>;
  result_gte?: InputMaybe<Scalars['BigInt']['input']>;
  result_lte?: InputMaybe<Scalars['BigInt']['input']>;
  result_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  result_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targetSlashAmount?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targetSlashAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Flag_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Flag_filter>>>;
};

export type Flag_orderBy =
  | 'id'
  | 'flagger'
  | 'flagger__id'
  | 'flagger__delegatorCount'
  | 'flagger__poolValue'
  | 'flagger__totalValueInSponsorshipsWei'
  | 'flagger__freeFundsWei'
  | 'flagger__poolValueTimestamp'
  | 'flagger__poolValueBlockNumber'
  | 'flagger__poolTokenTotalSupplyWei'
  | 'flagger__exchangeRate'
  | 'flagger__metadataJsonString'
  | 'flagger__owner'
  | 'target'
  | 'target__id'
  | 'target__delegatorCount'
  | 'target__poolValue'
  | 'target__totalValueInSponsorshipsWei'
  | 'target__freeFundsWei'
  | 'target__poolValueTimestamp'
  | 'target__poolValueBlockNumber'
  | 'target__poolTokenTotalSupplyWei'
  | 'target__exchangeRate'
  | 'target__metadataJsonString'
  | 'target__owner'
  | 'date'
  | 'sponsorship'
  | 'sponsorship__id'
  | 'sponsorship__metadata'
  | 'sponsorship__isRunning'
  | 'sponsorship__totalPayoutWeiPerSec'
  | 'sponsorship__operatorCount'
  | 'sponsorship__totalStakedWei'
  | 'sponsorship__unallocatedWei'
  | 'sponsorship__projectedInsolvency'
  | 'sponsorship__creator'
  | 'result'
  | 'targetSlashAmount';

export type Node = {
  /** node ID = address */
  id: Scalars['ID']['output'];
  /** Connection metadata, e.g. URL of the node, e.g. http://mynode.com:3000 */
  metadata: Scalars['String']['output'];
  /** Epoch timestamp of the last time the node metadata was updated */
  lastSeen: Scalars['BigInt']['output'];
  /** Streams for which this node is registered as a storage node in the StreamStorageRegistry */
  storedStreams?: Maybe<Array<Stream>>;
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
};


export type NodestoredStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};

export type Node_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastSeen?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastSeen_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  storedStreams?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_?: InputMaybe<Stream_filter>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Node_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Node_filter>>>;
};

export type Node_orderBy =
  | 'id'
  | 'metadata'
  | 'lastSeen'
  | 'storedStreams'
  | 'createdAt';

export type Operator = {
  id: Scalars['ID']['output'];
  stakes: Array<Stake>;
  delegators: Array<Delegation>;
  /** All delegators who have delegated to this operator. Increased when Delegation is created and decreased when Delegation is removed */
  delegatorCount: Scalars['Int']['output'];
  /** DATA staked, earned and held by the Operator contract = totalValueInSponsorshipsWei + freeFundsWei. Updated by PoolValueUpdate event, so might be out of date. */
  poolValue: Scalars['BigInt']['output'];
  /** DATA staked and earned in sponsorship contracts. Updated by PoolValueUpdate event, so it will be out of date by the amount of earnings. */
  totalValueInSponsorshipsWei: Scalars['BigInt']['output'];
  /** DATA held by the operator, not yet staked. Updated by PoolValueUpdate event, so might be out of date if new DATA is sent via `ERC20.transfer`. */
  freeFundsWei: Scalars['BigInt']['output'];
  /** Timestamp in seconds when poolValue was the best approximation of total DATA staked, earned and held by the Operator contract. Shows how much the poolValue is out of date. */
  poolValueTimestamp: Scalars['BigInt']['output'];
  /** Block number after which poolValue was the best approximation of total DATA staked, earned and held by the Operator contract. */
  poolValueBlockNumber: Scalars['BigInt']['output'];
  /** Total number of pool tokens in existence */
  poolTokenTotalSupplyWei: Scalars['BigInt']['output'];
  /** DATA/pooltoken exchange rate, equal to poolValue / totalSupply. Pool tokens are worth (exchangeRate * amount) DATA when undelegating. */
  exchangeRate: Scalars['BigDecimal']['output'];
  metadataJsonString: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  flagsOpened: Array<Flag>;
  flagsTargeted: Array<Flag>;
};


export type OperatorstakesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stake_filter>;
};


export type OperatordelegatorsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Delegation_filter>;
};


export type OperatorflagsOpenedArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Flag_filter>;
};


export type OperatorflagsTargetedArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Flag_filter>;
};

export type OperatorDailyBucket = {
  id: Scalars['ID']['output'];
  operator: Operator;
  /** The day of the bucket. This is a timestamp in seconds */
  date: Scalars['BigInt']['output'];
  /** DATA staked, earned and held by the Operator contract = totalValueInSponsorshipsWei + freeFundsWei (first event in bucket) */
  poolValue: Scalars['BigInt']['output'];
  /** DATA staked and earned in sponsorship contracts (first event in bucket) */
  totalValueInSponsorshipsWei: Scalars['BigInt']['output'];
  /** DATA held by the operator, not yet staked (first event in bucket) */
  freeFundsWei: Scalars['BigInt']['output'];
  /** Momentary APY. Currently not used. TODO: calculate and add to subgraph */
  spotAPY: Scalars['BigInt']['output'];
  /** All delegators joining this operator. Initialized from operator.delegatorCount */
  delegatorCountAtStart: Scalars['Int']['output'];
  /** Delegators joining this operator on this day. Updated when Delegation entity is created */
  delegatorCountChange: Scalars['Int']['output'];
  /** All DATA tokens delegated to this operator, by all delegators. Updated when Delegated event is fired */
  totalDelegatedWei: Scalars['BigInt']['output'];
  /** Total DATA tokens undelegated from this operator, by all delegators. Updated when Undelegated event is fired */
  totalUndelegatedWei: Scalars['BigInt']['output'];
  /** Sum of earnings during the bucket, less operator's share */
  profitsWei: Scalars['BigInt']['output'];
  /** Sum of losses during the bucket */
  lossesWei: Scalars['BigInt']['output'];
  /** Sum of operator's share of earnings during the bucket */
  operatorsShareWei: Scalars['BigInt']['output'];
};

export type OperatorDailyBucket_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_filter>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freeFundsWei?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freeFundsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatorCountAtStart?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountAtStart_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountChange?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountChange_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalDelegatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  profitsWei?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  profitsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lossesWei?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lossesWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorsShareWei?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorsShareWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OperatorDailyBucket_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OperatorDailyBucket_filter>>>;
};

export type OperatorDailyBucket_orderBy =
  | 'id'
  | 'operator'
  | 'operator__id'
  | 'operator__delegatorCount'
  | 'operator__poolValue'
  | 'operator__totalValueInSponsorshipsWei'
  | 'operator__freeFundsWei'
  | 'operator__poolValueTimestamp'
  | 'operator__poolValueBlockNumber'
  | 'operator__poolTokenTotalSupplyWei'
  | 'operator__exchangeRate'
  | 'operator__metadataJsonString'
  | 'operator__owner'
  | 'date'
  | 'poolValue'
  | 'totalValueInSponsorshipsWei'
  | 'freeFundsWei'
  | 'spotAPY'
  | 'delegatorCountAtStart'
  | 'delegatorCountChange'
  | 'totalDelegatedWei'
  | 'totalUndelegatedWei'
  | 'profitsWei'
  | 'lossesWei'
  | 'operatorsShareWei';

export type Operator_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  stakes_?: InputMaybe<Stake_filter>;
  delegators_?: InputMaybe<Delegation_filter>;
  delegatorCount?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  poolValue?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freeFundsWei?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freeFundsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolTokenTotalSupplyWei?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolTokenTotalSupplyWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  metadataJsonString?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_gt?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_lt?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_gte?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_lte?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataJsonString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataJsonString_contains?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagsOpened_?: InputMaybe<Flag_filter>;
  flagsTargeted_?: InputMaybe<Flag_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Operator_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Operator_filter>>>;
};

export type Operator_orderBy =
  | 'id'
  | 'stakes'
  | 'delegators'
  | 'delegatorCount'
  | 'poolValue'
  | 'totalValueInSponsorshipsWei'
  | 'freeFundsWei'
  | 'poolValueTimestamp'
  | 'poolValueBlockNumber'
  | 'poolTokenTotalSupplyWei'
  | 'exchangeRate'
  | 'metadataJsonString'
  | 'owner'
  | 'flagsOpened'
  | 'flagsTargeted';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Project = {
  /** project id = bytes32 */
  id: Scalars['ID']['output'];
  /** List of domain ids for the chains from which this project can be purchased */
  domainIds: Array<Scalars['BigInt']['output']>;
  /** Payment details for the chains where the project can be purchased: mapping (uint32 => PaymentDetailsByChain) */
  paymentDetails: Array<ProjectPaymentDetails>;
  /** The minimum amount of seconds for which a subscription can be extended. This is a normal int value (not wei) */
  minimumSubscriptionSeconds: Scalars['BigInt']['output'];
  /** Subscriptions mapping (address => TimeBasedSubscription) */
  subscriptions: Array<ProjectSubscription>;
  /** Project metadata JSON */
  metadata: Scalars['String']['output'];
  /** Flags a project as being a data union, true iff 'isDataUnion' field is set to 'true' in the metadata JSON */
  isDataUnion?: Maybe<Scalars['Boolean']['output']>;
  /** Streams added to the project */
  streams: Array<Scalars['String']['output']>;
  /** Permissions mapping (bytes32 => Permission) */
  permissions: Array<ProjectPermission>;
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Marketplace purchases */
  purchases: Array<ProjectPurchase>;
  /** Incremented/decremented when Stake/Unstake events are fired. It may not always be 1:1 with the stake (with future implementations) */
  score: Scalars['BigInt']['output'];
  /** Total tokens staked in the project by all stakers */
  stakedWei: Scalars['BigInt']['output'];
  /** Increases when various actions are triggered (e.g. purchase, stake, unstake). Used to generate unique ids */
  counter?: Maybe<Scalars['Int']['output']>;
};


export type ProjectpaymentDetailsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPaymentDetails_filter>;
};


export type ProjectsubscriptionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectSubscription_filter>;
};


export type ProjectpermissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPermission_filter>;
};


export type ProjectpurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPurchase_filter>;
};

export type ProjectPaymentDetails = {
  /** payment details id = projectId + '-' + domainId */
  id: Scalars['ID']['output'];
  /** Target project this payment details applies to */
  project: Project;
  /** The domainId of the chain where the project can be purchased. It's a unique id assigned by hyperlane to each chain */
  domainId?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, account where the payment is directed to for project purchases */
  beneficiary: Scalars['Bytes']['output'];
  /** Ethereum address, the token in which the payment goes to project beneficiary */
  pricingTokenAddress: Scalars['Bytes']['output'];
  /** Project price per second. This is a DATA-wei denominated amount (10^18th of DATA token). */
  pricePerSecond?: Maybe<Scalars['BigInt']['output']>;
};

export type ProjectPaymentDetails_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_filter>;
  domainId?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beneficiary?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_lt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_lte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingTokenAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerSecond_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPaymentDetails_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPaymentDetails_filter>>>;
};

export type ProjectPaymentDetails_orderBy =
  | 'id'
  | 'project'
  | 'project__id'
  | 'project__minimumSubscriptionSeconds'
  | 'project__metadata'
  | 'project__isDataUnion'
  | 'project__createdAt'
  | 'project__updatedAt'
  | 'project__score'
  | 'project__stakedWei'
  | 'project__counter'
  | 'domainId'
  | 'beneficiary'
  | 'pricingTokenAddress'
  | 'pricePerSecond';

export type ProjectPermission = {
  /** permission id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Ethereum address, owner of this permission */
  userAddress: Scalars['Bytes']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** canBuy permission enables a user to buy the project */
  canBuy?: Maybe<Scalars['Boolean']['output']>;
  /** canDelete permission allows deleting the project from the ProjectRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** canEdit permission enables changing the project's fields */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** canGrant permission allows granting and revoking permissions to this project */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
};

export type ProjectPermission_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_filter>;
  canBuy?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_not?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canBuy_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPermission_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPermission_filter>>>;
};

export type ProjectPermission_orderBy =
  | 'id'
  | 'userAddress'
  | 'project'
  | 'project__id'
  | 'project__minimumSubscriptionSeconds'
  | 'project__metadata'
  | 'project__isDataUnion'
  | 'project__createdAt'
  | 'project__updatedAt'
  | 'project__score'
  | 'project__stakedWei'
  | 'project__counter'
  | 'canBuy'
  | 'canDelete'
  | 'canEdit'
  | 'canGrant';

export type ProjectPurchase = {
  /** project purchase id = projectId + '-' + subscriberAddress + '-' + counter */
  id: Scalars['ID']['output'];
  /** Target project this purchase is for */
  project: Project;
  /** Ethereum address, the account initiating the project purchase */
  subscriber: Scalars['Bytes']['output'];
  /** The amount of seconds by which the subscription is extended */
  subscriptionSeconds: Scalars['BigInt']['output'];
  /** The amount of tokens paid to beneficiary for project subscription */
  price: Scalars['BigInt']['output'];
  /** The amount of tokens paid to marketplace for project subscription */
  fee: Scalars['BigInt']['output'];
  /** purchase date. This is a timestamp in seconds */
  purchasedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type ProjectPurchase_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_filter>;
  subscriber?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_lt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_lte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriber_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriber_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fee?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchasedAt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchasedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPurchase_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPurchase_filter>>>;
};

export type ProjectPurchase_orderBy =
  | 'id'
  | 'project'
  | 'project__id'
  | 'project__minimumSubscriptionSeconds'
  | 'project__metadata'
  | 'project__isDataUnion'
  | 'project__createdAt'
  | 'project__updatedAt'
  | 'project__score'
  | 'project__stakedWei'
  | 'project__counter'
  | 'subscriber'
  | 'subscriptionSeconds'
  | 'price'
  | 'fee'
  | 'purchasedAt';

export type ProjectStakeByUser = {
  /** stake id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** Ethereum address, the account initiating the stake */
  user: Scalars['Bytes']['output'];
  /** All tokens staked by a given user */
  userStake: Scalars['BigInt']['output'];
};

export type ProjectStakeByUser_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_filter>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userStake?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_not?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectStakeByUser_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ProjectStakeByUser_filter>>>;
};

export type ProjectStakeByUser_orderBy =
  | 'id'
  | 'project'
  | 'project__id'
  | 'project__minimumSubscriptionSeconds'
  | 'project__metadata'
  | 'project__isDataUnion'
  | 'project__createdAt'
  | 'project__updatedAt'
  | 'project__score'
  | 'project__stakedWei'
  | 'project__counter'
  | 'user'
  | 'userStake';

export type ProjectStakingDayBucket = {
  /** bucket id = projectId + '-' + date */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** The day of the bucket */
  date: Scalars['BigInt']['output'];
  /** The amount of tokens staked when the bucket starts */
  stakeAtStart: Scalars['BigInt']['output'];
  /** The amount of tokens staked/unstaked on this day */
  stakeChange: Scalars['BigInt']['output'];
  /** The amount of tokens staked on this day */
  stakingsWei: Scalars['BigInt']['output'];
  /** The amount of tokens unstaked on this day */
  unstakingsWei: Scalars['BigInt']['output'];
};

export type ProjectStakingDayBucket_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_filter>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeAtStart?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeAtStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeChange?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeChange_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingsWei?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakingsWei?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakingsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectStakingDayBucket_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ProjectStakingDayBucket_filter>>>;
};

export type ProjectStakingDayBucket_orderBy =
  | 'id'
  | 'project'
  | 'project__id'
  | 'project__minimumSubscriptionSeconds'
  | 'project__metadata'
  | 'project__isDataUnion'
  | 'project__createdAt'
  | 'project__updatedAt'
  | 'project__score'
  | 'project__stakedWei'
  | 'project__counter'
  | 'date'
  | 'stakeAtStart'
  | 'stakeChange'
  | 'stakingsWei'
  | 'unstakingsWei';

export type ProjectSubscription = {
  /** subscription id = projectId + '-' + subscriberAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this subscription */
  userAddress: Scalars['Bytes']['output'];
  /** Subscription expiration time. This is a timestamp in seconds */
  endTimestamp?: Maybe<Scalars['BigInt']['output']>;
};

export type ProjectSubscription_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_filter>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectSubscription_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ProjectSubscription_filter>>>;
};

export type ProjectSubscription_orderBy =
  | 'id'
  | 'project'
  | 'project__id'
  | 'project__minimumSubscriptionSeconds'
  | 'project__metadata'
  | 'project__isDataUnion'
  | 'project__createdAt'
  | 'project__updatedAt'
  | 'project__score'
  | 'project__stakedWei'
  | 'project__counter'
  | 'userAddress'
  | 'endTimestamp';

export type Project_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  domainIds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  paymentDetails?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_?: InputMaybe<ProjectPaymentDetails_filter>;
  minimumSubscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumSubscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriptions?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_?: InputMaybe<ProjectSubscription_filter>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  isDataUnion?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDataUnion_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  streams?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_?: InputMaybe<ProjectPermission_filter>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchases?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_?: InputMaybe<ProjectPurchase_filter>;
  score?: InputMaybe<Scalars['BigInt']['input']>;
  score_not?: InputMaybe<Scalars['BigInt']['input']>;
  score_gt?: InputMaybe<Scalars['BigInt']['input']>;
  score_lt?: InputMaybe<Scalars['BigInt']['input']>;
  score_gte?: InputMaybe<Scalars['BigInt']['input']>;
  score_lte?: InputMaybe<Scalars['BigInt']['input']>;
  score_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  score_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  counter?: InputMaybe<Scalars['Int']['input']>;
  counter_not?: InputMaybe<Scalars['Int']['input']>;
  counter_gt?: InputMaybe<Scalars['Int']['input']>;
  counter_lt?: InputMaybe<Scalars['Int']['input']>;
  counter_gte?: InputMaybe<Scalars['Int']['input']>;
  counter_lte?: InputMaybe<Scalars['Int']['input']>;
  counter_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  counter_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Project_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Project_filter>>>;
};

export type Project_orderBy =
  | 'id'
  | 'domainIds'
  | 'paymentDetails'
  | 'minimumSubscriptionSeconds'
  | 'subscriptions'
  | 'metadata'
  | 'isDataUnion'
  | 'streams'
  | 'permissions'
  | 'createdAt'
  | 'updatedAt'
  | 'purchases'
  | 'score'
  | 'stakedWei'
  | 'counter';

export type Query = {
  streamPermission?: Maybe<StreamPermission>;
  streamPermissions: Array<StreamPermission>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  projectPermission?: Maybe<ProjectPermission>;
  projectPermissions: Array<ProjectPermission>;
  projectPaymentDetails: Array<ProjectPaymentDetails>;
  projectSubscription?: Maybe<ProjectSubscription>;
  projectSubscriptions: Array<ProjectSubscription>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectStakeByUser?: Maybe<ProjectStakeByUser>;
  projectStakeByUsers: Array<ProjectStakeByUser>;
  projectStakingDayBucket?: Maybe<ProjectStakingDayBucket>;
  projectStakingDayBuckets: Array<ProjectStakingDayBucket>;
  operator?: Maybe<Operator>;
  operators: Array<Operator>;
  operatorDailyBucket?: Maybe<OperatorDailyBucket>;
  operatorDailyBuckets: Array<OperatorDailyBucket>;
  delegation?: Maybe<Delegation>;
  delegations: Array<Delegation>;
  sponsorship?: Maybe<Sponsorship>;
  sponsorships: Array<Sponsorship>;
  sponsorshipDailyBucket?: Maybe<SponsorshipDailyBucket>;
  sponsorshipDailyBuckets: Array<SponsorshipDailyBucket>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  flag?: Maybe<Flag>;
  flags: Array<Flag>;
  projectSearch: Array<Project>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerystreamPermissionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamPermissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StreamPermission_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynodeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynodesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Node_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectPermissionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectPermissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPermission_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectPaymentDetailsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPaymentDetails_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectSubscriptionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectSubscriptionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectSubscription_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Project_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectPurchaseArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectPurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPurchase_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectStakeByUserArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectStakeByUsersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakeByUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectStakeByUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectStakingDayBucketArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectStakingDayBucketsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakingDayBucket_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectStakingDayBucket_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryoperatorArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryoperatorsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Operator_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryoperatorDailyBucketArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryoperatorDailyBucketsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDailyBucket_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OperatorDailyBucket_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydelegationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydelegationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Delegation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysponsorshipArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysponsorshipsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Sponsorship_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysponsorshipDailyBucketArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysponsorshipDailyBucketsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsorshipDailyBucket_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SponsorshipDailyBucket_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystakeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystakesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stake_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryflagArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryflagsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Flag_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryprojectSearchArgs = {
  text: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Sponsorship = {
  id: Scalars['ID']['output'];
  stream?: Maybe<Stream>;
  metadata?: Maybe<Scalars['String']['output']>;
  isRunning: Scalars['Boolean']['output'];
  totalPayoutWeiPerSec: Scalars['BigInt']['output'];
  stakes: Array<Stake>;
  operatorCount: Scalars['Int']['output'];
  totalStakedWei: Scalars['BigInt']['output'];
  unallocatedWei: Scalars['BigInt']['output'];
  projectedInsolvency: Scalars['BigInt']['output'];
  flags: Array<Flag>;
  creator: Scalars['String']['output'];
};


export type SponsorshipstakesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stake_filter>;
};


export type SponsorshipflagsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Flag_filter>;
};

export type SponsorshipDailyBucket = {
  id: Scalars['ID']['output'];
  sponsorship: Sponsorship;
  date: Scalars['BigInt']['output'];
  totalStakedWei: Scalars['BigInt']['output'];
  unallocatedWei: Scalars['BigInt']['output'];
  projectedInsolvency: Scalars['BigInt']['output'];
  spotAPY: Scalars['BigInt']['output'];
  totalPayoutsCumulative: Scalars['BigInt']['output'];
  operatorCount: Scalars['Int']['output'];
};

export type SponsorshipDailyBucket_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_filter>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutsCumulative?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutsCumulative_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SponsorshipDailyBucket_filter>>>;
  or?: InputMaybe<Array<InputMaybe<SponsorshipDailyBucket_filter>>>;
};

export type SponsorshipDailyBucket_orderBy =
  | 'id'
  | 'sponsorship'
  | 'sponsorship__id'
  | 'sponsorship__metadata'
  | 'sponsorship__isRunning'
  | 'sponsorship__totalPayoutWeiPerSec'
  | 'sponsorship__operatorCount'
  | 'sponsorship__totalStakedWei'
  | 'sponsorship__unallocatedWei'
  | 'sponsorship__projectedInsolvency'
  | 'sponsorship__creator'
  | 'date'
  | 'totalStakedWei'
  | 'unallocatedWei'
  | 'projectedInsolvency'
  | 'spotAPY'
  | 'totalPayoutsCumulative'
  | 'operatorCount';

export type Sponsorship_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  stream?: InputMaybe<Scalars['String']['input']>;
  stream_not?: InputMaybe<Scalars['String']['input']>;
  stream_gt?: InputMaybe<Scalars['String']['input']>;
  stream_lt?: InputMaybe<Scalars['String']['input']>;
  stream_gte?: InputMaybe<Scalars['String']['input']>;
  stream_lte?: InputMaybe<Scalars['String']['input']>;
  stream_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_contains?: InputMaybe<Scalars['String']['input']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_?: InputMaybe<Stream_filter>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  isRunning?: InputMaybe<Scalars['Boolean']['input']>;
  isRunning_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRunning_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRunning_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  totalPayoutWeiPerSec?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutWeiPerSec_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakes_?: InputMaybe<Stake_filter>;
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalStakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flags_?: InputMaybe<Flag_filter>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Sponsorship_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Sponsorship_filter>>>;
};

export type Sponsorship_orderBy =
  | 'id'
  | 'stream'
  | 'stream__id'
  | 'stream__metadata'
  | 'stream__createdAt'
  | 'stream__updatedAt'
  | 'metadata'
  | 'isRunning'
  | 'totalPayoutWeiPerSec'
  | 'stakes'
  | 'operatorCount'
  | 'totalStakedWei'
  | 'unallocatedWei'
  | 'projectedInsolvency'
  | 'flags'
  | 'creator';

export type Stake = {
  id: Scalars['ID']['output'];
  operator: Operator;
  amount: Scalars['BigInt']['output'];
  allocatedWei: Scalars['BigInt']['output'];
  date?: Maybe<Scalars['BigInt']['output']>;
  sponsorship?: Maybe<Sponsorship>;
};

export type Stake_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_filter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Stake_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Stake_filter>>>;
};

export type Stake_orderBy =
  | 'id'
  | 'operator'
  | 'operator__id'
  | 'operator__delegatorCount'
  | 'operator__poolValue'
  | 'operator__totalValueInSponsorshipsWei'
  | 'operator__freeFundsWei'
  | 'operator__poolValueTimestamp'
  | 'operator__poolValueBlockNumber'
  | 'operator__poolTokenTotalSupplyWei'
  | 'operator__exchangeRate'
  | 'operator__metadataJsonString'
  | 'operator__owner'
  | 'amount'
  | 'allocatedWei'
  | 'date'
  | 'sponsorship'
  | 'sponsorship__id'
  | 'sponsorship__metadata'
  | 'sponsorship__isRunning'
  | 'sponsorship__totalPayoutWeiPerSec'
  | 'sponsorship__operatorCount'
  | 'sponsorship__totalStakedWei'
  | 'sponsorship__unallocatedWei'
  | 'sponsorship__projectedInsolvency'
  | 'sponsorship__creator';

export type Stream = {
  /** stream ID = 'creator address'/'path' where path can be any string */
  id: Scalars['ID']['output'];
  /** Stream metadata JSON */
  metadata: Scalars['String']['output'];
  /** Permissions that each Ethereum address owns to this stream */
  permissions?: Maybe<Array<StreamPermission>>;
  /** Nodes the have been registered as storage nodes to this stream in the StreamStorageRegistry */
  storageNodes?: Maybe<Array<Node>>;
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  sponsorships?: Maybe<Array<Sponsorship>>;
};


export type StreampermissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StreamPermission_filter>;
};


export type StreamstorageNodesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Node_filter>;
};


export type StreamsponsorshipsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Sponsorship_filter>;
};

export type StreamPermission = {
  id: Scalars['ID']['output'];
  /** Ethereum address, owner of this permission */
  userAddress: Scalars['Bytes']['output'];
  /** Target stream this permission applies to */
  stream?: Maybe<Stream>;
  /** Edit permission enables changing the stream's metadata */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** canDelete permission allows deleting the stream from the StreamRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** publishExpiration timestamp tells until what time this address may publish data to the stream */
  publishExpiration?: Maybe<Scalars['BigInt']['output']>;
  /** subscribeExpires timestamp tells until what time this address may subscribe to the stream */
  subscribeExpiration?: Maybe<Scalars['BigInt']['output']>;
  /** grant permission allows granting and revoking permissions to this stream */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
};

export type StreamPermission_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stream?: InputMaybe<Scalars['String']['input']>;
  stream_not?: InputMaybe<Scalars['String']['input']>;
  stream_gt?: InputMaybe<Scalars['String']['input']>;
  stream_lt?: InputMaybe<Scalars['String']['input']>;
  stream_gte?: InputMaybe<Scalars['String']['input']>;
  stream_lte?: InputMaybe<Scalars['String']['input']>;
  stream_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_contains?: InputMaybe<Scalars['String']['input']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_?: InputMaybe<Stream_filter>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  publishExpiration?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_not?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  publishExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscribeExpiration?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscribeExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StreamPermission_filter>>>;
  or?: InputMaybe<Array<InputMaybe<StreamPermission_filter>>>;
};

export type StreamPermission_orderBy =
  | 'id'
  | 'userAddress'
  | 'stream'
  | 'stream__id'
  | 'stream__metadata'
  | 'stream__createdAt'
  | 'stream__updatedAt'
  | 'canEdit'
  | 'canDelete'
  | 'publishExpiration'
  | 'subscribeExpiration'
  | 'canGrant';

export type Stream_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  permissions_?: InputMaybe<StreamPermission_filter>;
  storageNodes_?: InputMaybe<Node_filter>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorships_?: InputMaybe<Sponsorship_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Stream_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Stream_filter>>>;
};

export type Stream_orderBy =
  | 'id'
  | 'metadata'
  | 'permissions'
  | 'storageNodes'
  | 'createdAt'
  | 'updatedAt'
  | 'sponsorships';

export type Subscription = {
  streamPermission?: Maybe<StreamPermission>;
  streamPermissions: Array<StreamPermission>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  projectPermission?: Maybe<ProjectPermission>;
  projectPermissions: Array<ProjectPermission>;
  projectPaymentDetails: Array<ProjectPaymentDetails>;
  projectSubscription?: Maybe<ProjectSubscription>;
  projectSubscriptions: Array<ProjectSubscription>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectStakeByUser?: Maybe<ProjectStakeByUser>;
  projectStakeByUsers: Array<ProjectStakeByUser>;
  projectStakingDayBucket?: Maybe<ProjectStakingDayBucket>;
  projectStakingDayBuckets: Array<ProjectStakingDayBucket>;
  operator?: Maybe<Operator>;
  operators: Array<Operator>;
  operatorDailyBucket?: Maybe<OperatorDailyBucket>;
  operatorDailyBuckets: Array<OperatorDailyBucket>;
  delegation?: Maybe<Delegation>;
  delegations: Array<Delegation>;
  sponsorship?: Maybe<Sponsorship>;
  sponsorships: Array<Sponsorship>;
  sponsorshipDailyBucket?: Maybe<SponsorshipDailyBucket>;
  sponsorshipDailyBuckets: Array<SponsorshipDailyBucket>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  flag?: Maybe<Flag>;
  flags: Array<Flag>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionstreamPermissionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamPermissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StreamPermission_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnodeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnodesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Node_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectPermissionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectPermissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPermission_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectPaymentDetailsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPaymentDetails_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectSubscriptionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectSubscriptionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectSubscription_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Project_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectPurchaseArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectPurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectPurchase_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectStakeByUserArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectStakeByUsersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakeByUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectStakeByUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectStakingDayBucketArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionprojectStakingDayBucketsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakingDayBucket_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ProjectStakingDayBucket_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionoperatorArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionoperatorsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Operator_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionoperatorDailyBucketArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionoperatorDailyBucketsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDailyBucket_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OperatorDailyBucket_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondelegationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondelegationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Delegation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsponsorshipArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsponsorshipsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Sponsorship_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsponsorshipDailyBucketArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsponsorshipDailyBucketsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsorshipDailyBucket_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SponsorshipDailyBucket_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstakeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstakesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stake_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionflagArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionflagsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Flag_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  streamPermission: InContextSdkMethod<Query['streamPermission'], QuerystreamPermissionArgs, MeshContext>,
  /** null **/
  streamPermissions: InContextSdkMethod<Query['streamPermissions'], QuerystreamPermissionsArgs, MeshContext>,
  /** null **/
  stream: InContextSdkMethod<Query['stream'], QuerystreamArgs, MeshContext>,
  /** null **/
  streams: InContextSdkMethod<Query['streams'], QuerystreamsArgs, MeshContext>,
  /** null **/
  node: InContextSdkMethod<Query['node'], QuerynodeArgs, MeshContext>,
  /** null **/
  nodes: InContextSdkMethod<Query['nodes'], QuerynodesArgs, MeshContext>,
  /** null **/
  projectPermission: InContextSdkMethod<Query['projectPermission'], QueryprojectPermissionArgs, MeshContext>,
  /** null **/
  projectPermissions: InContextSdkMethod<Query['projectPermissions'], QueryprojectPermissionsArgs, MeshContext>,
  /** null **/
  projectPaymentDetails: InContextSdkMethod<Query['projectPaymentDetails'], QueryprojectPaymentDetailsArgs, MeshContext>,
  /** null **/
  projectSubscription: InContextSdkMethod<Query['projectSubscription'], QueryprojectSubscriptionArgs, MeshContext>,
  /** null **/
  projectSubscriptions: InContextSdkMethod<Query['projectSubscriptions'], QueryprojectSubscriptionsArgs, MeshContext>,
  /** null **/
  project: InContextSdkMethod<Query['project'], QueryprojectArgs, MeshContext>,
  /** null **/
  projects: InContextSdkMethod<Query['projects'], QueryprojectsArgs, MeshContext>,
  /** null **/
  projectPurchase: InContextSdkMethod<Query['projectPurchase'], QueryprojectPurchaseArgs, MeshContext>,
  /** null **/
  projectPurchases: InContextSdkMethod<Query['projectPurchases'], QueryprojectPurchasesArgs, MeshContext>,
  /** null **/
  projectStakeByUser: InContextSdkMethod<Query['projectStakeByUser'], QueryprojectStakeByUserArgs, MeshContext>,
  /** null **/
  projectStakeByUsers: InContextSdkMethod<Query['projectStakeByUsers'], QueryprojectStakeByUsersArgs, MeshContext>,
  /** null **/
  projectStakingDayBucket: InContextSdkMethod<Query['projectStakingDayBucket'], QueryprojectStakingDayBucketArgs, MeshContext>,
  /** null **/
  projectStakingDayBuckets: InContextSdkMethod<Query['projectStakingDayBuckets'], QueryprojectStakingDayBucketsArgs, MeshContext>,
  /** null **/
  operator: InContextSdkMethod<Query['operator'], QueryoperatorArgs, MeshContext>,
  /** null **/
  operators: InContextSdkMethod<Query['operators'], QueryoperatorsArgs, MeshContext>,
  /** null **/
  operatorDailyBucket: InContextSdkMethod<Query['operatorDailyBucket'], QueryoperatorDailyBucketArgs, MeshContext>,
  /** null **/
  operatorDailyBuckets: InContextSdkMethod<Query['operatorDailyBuckets'], QueryoperatorDailyBucketsArgs, MeshContext>,
  /** null **/
  delegation: InContextSdkMethod<Query['delegation'], QuerydelegationArgs, MeshContext>,
  /** null **/
  delegations: InContextSdkMethod<Query['delegations'], QuerydelegationsArgs, MeshContext>,
  /** null **/
  sponsorship: InContextSdkMethod<Query['sponsorship'], QuerysponsorshipArgs, MeshContext>,
  /** null **/
  sponsorships: InContextSdkMethod<Query['sponsorships'], QuerysponsorshipsArgs, MeshContext>,
  /** null **/
  sponsorshipDailyBucket: InContextSdkMethod<Query['sponsorshipDailyBucket'], QuerysponsorshipDailyBucketArgs, MeshContext>,
  /** null **/
  sponsorshipDailyBuckets: InContextSdkMethod<Query['sponsorshipDailyBuckets'], QuerysponsorshipDailyBucketsArgs, MeshContext>,
  /** null **/
  stake: InContextSdkMethod<Query['stake'], QuerystakeArgs, MeshContext>,
  /** null **/
  stakes: InContextSdkMethod<Query['stakes'], QuerystakesArgs, MeshContext>,
  /** null **/
  flag: InContextSdkMethod<Query['flag'], QueryflagArgs, MeshContext>,
  /** null **/
  flags: InContextSdkMethod<Query['flags'], QueryflagsArgs, MeshContext>,
  /** null **/
  projectSearch: InContextSdkMethod<Query['projectSearch'], QueryprojectSearchArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  streamPermission: InContextSdkMethod<Subscription['streamPermission'], SubscriptionstreamPermissionArgs, MeshContext>,
  /** null **/
  streamPermissions: InContextSdkMethod<Subscription['streamPermissions'], SubscriptionstreamPermissionsArgs, MeshContext>,
  /** null **/
  stream: InContextSdkMethod<Subscription['stream'], SubscriptionstreamArgs, MeshContext>,
  /** null **/
  streams: InContextSdkMethod<Subscription['streams'], SubscriptionstreamsArgs, MeshContext>,
  /** null **/
  node: InContextSdkMethod<Subscription['node'], SubscriptionnodeArgs, MeshContext>,
  /** null **/
  nodes: InContextSdkMethod<Subscription['nodes'], SubscriptionnodesArgs, MeshContext>,
  /** null **/
  projectPermission: InContextSdkMethod<Subscription['projectPermission'], SubscriptionprojectPermissionArgs, MeshContext>,
  /** null **/
  projectPermissions: InContextSdkMethod<Subscription['projectPermissions'], SubscriptionprojectPermissionsArgs, MeshContext>,
  /** null **/
  projectPaymentDetails: InContextSdkMethod<Subscription['projectPaymentDetails'], SubscriptionprojectPaymentDetailsArgs, MeshContext>,
  /** null **/
  projectSubscription: InContextSdkMethod<Subscription['projectSubscription'], SubscriptionprojectSubscriptionArgs, MeshContext>,
  /** null **/
  projectSubscriptions: InContextSdkMethod<Subscription['projectSubscriptions'], SubscriptionprojectSubscriptionsArgs, MeshContext>,
  /** null **/
  project: InContextSdkMethod<Subscription['project'], SubscriptionprojectArgs, MeshContext>,
  /** null **/
  projects: InContextSdkMethod<Subscription['projects'], SubscriptionprojectsArgs, MeshContext>,
  /** null **/
  projectPurchase: InContextSdkMethod<Subscription['projectPurchase'], SubscriptionprojectPurchaseArgs, MeshContext>,
  /** null **/
  projectPurchases: InContextSdkMethod<Subscription['projectPurchases'], SubscriptionprojectPurchasesArgs, MeshContext>,
  /** null **/
  projectStakeByUser: InContextSdkMethod<Subscription['projectStakeByUser'], SubscriptionprojectStakeByUserArgs, MeshContext>,
  /** null **/
  projectStakeByUsers: InContextSdkMethod<Subscription['projectStakeByUsers'], SubscriptionprojectStakeByUsersArgs, MeshContext>,
  /** null **/
  projectStakingDayBucket: InContextSdkMethod<Subscription['projectStakingDayBucket'], SubscriptionprojectStakingDayBucketArgs, MeshContext>,
  /** null **/
  projectStakingDayBuckets: InContextSdkMethod<Subscription['projectStakingDayBuckets'], SubscriptionprojectStakingDayBucketsArgs, MeshContext>,
  /** null **/
  operator: InContextSdkMethod<Subscription['operator'], SubscriptionoperatorArgs, MeshContext>,
  /** null **/
  operators: InContextSdkMethod<Subscription['operators'], SubscriptionoperatorsArgs, MeshContext>,
  /** null **/
  operatorDailyBucket: InContextSdkMethod<Subscription['operatorDailyBucket'], SubscriptionoperatorDailyBucketArgs, MeshContext>,
  /** null **/
  operatorDailyBuckets: InContextSdkMethod<Subscription['operatorDailyBuckets'], SubscriptionoperatorDailyBucketsArgs, MeshContext>,
  /** null **/
  delegation: InContextSdkMethod<Subscription['delegation'], SubscriptiondelegationArgs, MeshContext>,
  /** null **/
  delegations: InContextSdkMethod<Subscription['delegations'], SubscriptiondelegationsArgs, MeshContext>,
  /** null **/
  sponsorship: InContextSdkMethod<Subscription['sponsorship'], SubscriptionsponsorshipArgs, MeshContext>,
  /** null **/
  sponsorships: InContextSdkMethod<Subscription['sponsorships'], SubscriptionsponsorshipsArgs, MeshContext>,
  /** null **/
  sponsorshipDailyBucket: InContextSdkMethod<Subscription['sponsorshipDailyBucket'], SubscriptionsponsorshipDailyBucketArgs, MeshContext>,
  /** null **/
  sponsorshipDailyBuckets: InContextSdkMethod<Subscription['sponsorshipDailyBuckets'], SubscriptionsponsorshipDailyBucketsArgs, MeshContext>,
  /** null **/
  stake: InContextSdkMethod<Subscription['stake'], SubscriptionstakeArgs, MeshContext>,
  /** null **/
  stakes: InContextSdkMethod<Subscription['stakes'], SubscriptionstakesArgs, MeshContext>,
  /** null **/
  flag: InContextSdkMethod<Subscription['flag'], SubscriptionflagArgs, MeshContext>,
  /** null **/
  flags: InContextSdkMethod<Subscription['flags'], SubscriptionflagsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["streamr"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
